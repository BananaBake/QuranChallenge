import { useState, useRef, useEffect } from "react";
import { ArabesqueBorder } from "./arabesque-border";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { Button } from "./button";
import axios from "axios";

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
    // Don't do anything if we're already playing
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }
    
    // If we already have an audio element, just play it
    if (audioRef.current) {
      audioRef.current.play()
        .catch(error => {
          console.error("Error playing audio:", error);
        });
      return;
    }
    
    // Otherwise, load the audio and play it
    
    // Set loading state
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
        console.error("Error loading or playing audio:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to set up audio event listeners
  const setupAudioEvents = (audio: HTMLAudioElement) => {
    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    
    // Add cleanup to the audio element itself
    audio.addEventListener('ended', () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
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
        
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-primary hover:bg-primary/10"
            onClick={loadAndPlayAudio}
            disabled={!ayahRef && !audioUrl}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Listen</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </ArabesqueBorder>
  );
}
