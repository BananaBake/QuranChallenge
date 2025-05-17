import { useState, useRef, useEffect, ReactNode } from "react";
import { ArabesqueBorder } from "./arabesque-border";
import { Play, Pause, Loader2 } from "lucide-react";
import { Button } from "./button";
import axios from "axios";

interface AudioButtonProps {
  isLoading: boolean;
  isPlaying: boolean;
  disabled?: boolean;
  onClick: () => void;
}

// Reusable audio control button component
function AudioButton({ isLoading, isPlaying, disabled, onClick }: AudioButtonProps) {
  let icon: ReactNode;
  let text: string;
  
  if (isLoading) {
    icon = <Loader2 className="h-4 w-4 animate-spin" />;
    text = "Loading";
  } else if (isPlaying) {
    icon = <Pause className="h-4 w-4" />;
    text = "Pause";
  } else {
    icon = <Play className="h-4 w-4" />;
    text = "Listen";
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 text-primary hover:bg-primary/10"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {icon}
      <span>{text}</span>
    </Button>
  );
}

interface QuranTextProps {
  arabicText: string;
  audioUrl?: string;
  ayahRef?: string;  // For delayed audio loading
}

export function QuranText({ 
  arabicText,
  audioUrl,
  ayahRef
}: QuranTextProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAyahRef = useRef<string | undefined>(ayahRef);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Track when ayahRef changes to reset audio state
  useEffect(() => {
    // If ayahRef changed, reset everything
    if (ayahRef !== currentAyahRef.current) {
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Reset state
      setIsPlaying(false);
      setIsLoading(false);
      setAudioError(null);
      currentAyahRef.current = ayahRef;
    }
  }, [ayahRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadAndPlayAudio = async () => {
    // Toggle pause/play if audio is already loaded
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    
    // If audio is already loaded but not playing, play it
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setAudioError(null);
      } catch (error) {
        setAudioError("Unable to play audio. Please try again.");
      }
      return;
    }
    
    // Otherwise, load the audio and play it
    setIsLoading(true);
    
    // Cancel any previous requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      // Use direct audio URL if available
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        setupAudioEvents(audio);
        audioRef.current = audio;
        await audio.play();
        setIsPlaying(true);
      } 
      // Otherwise fetch from API
      else if (ayahRef) {
        const response = await axios.get(`/api/quran/audio/${ayahRef}`, {
          signal: abortControllerRef.current.signal
        });
        
        if (response.data && response.data.audio) {
          const audio = new Audio(response.data.audio);
          setupAudioEvents(audio);
          audioRef.current = audio;
          await audio.play();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        setAudioError("Failed to load audio. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to set up audio event listeners
  const setupAudioEvents = (audio: HTMLAudioElement) => {
    const handleEnded = () => {
      setIsPlaying(false);
      // Clean up references when audio finishes
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleError = (e: Event) => {
      setAudioError("Audio playback failed. Please try again.");
      setIsPlaying(false);
      // Clean up references on error
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
    
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    
    // Add cleanup to the audio element itself
    audio.addEventListener('ended', () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    }, { once: true });
  };

  return (
    <ArabesqueBorder className="mb-6">
      <div className="p-6 text-center">
        <p 
          className="font-arabic text-center text-3xl leading-relaxed text-primary" 
          dir="rtl"
          style={{ 
            fontWeight: 700, 
            lineHeight: 1.8,
            fontFamily: "'Uthmanic', 'Scheherazade New', serif"
          }}
        >
          {arabicText}
        </p>
        
        <div className="mt-4 flex flex-col items-center">
          <AudioButton
            isLoading={isLoading}
            isPlaying={isPlaying}
            onClick={loadAndPlayAudio}
            disabled={!ayahRef && !audioUrl}
          />
          
          {audioError && (
            <p className="text-red-500 text-sm mt-2">{audioError}</p>
          )}
        </div>
      </div>
    </ArabesqueBorder>
  );
}