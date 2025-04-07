import { useState, useRef, useEffect } from "react";
import { ArabesqueBorder } from "./arabesque-border";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { Button } from "./button";
import axios from "axios";

interface QuranTextProps {
  arabicText: string;
  audioUrl?: string;
  ayahRef?: string;  // New prop for delayed audio loading
}

export function QuranText({ 
  arabicText,
  audioUrl,
  ayahRef
}: QuranTextProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedAudioUrl, setLoadedAudioUrl] = useState<string | undefined>(audioUrl);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create/update audio element when component mounts or audioUrl changes
  useEffect(() => {
    // If there's an existing audio element playing, pause it
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    if (loadedAudioUrl) {
      const audio = new Audio(loadedAudioUrl);
      audioRef.current = audio;
      
      // Add event listeners
      const handleEnded = () => setIsPlaying(false);
      const handlePause = () => setIsPlaying(false);
      const handlePlay = () => setIsPlaying(true);
      
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('play', handlePlay);
      
      // Clean up
      return () => {
        audio.pause();
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('play', handlePlay);
      };
    }
  }, [loadedAudioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadAudio = async () => {
    // Only fetch if we have an ayahRef and no loaded audio yet
    if (ayahRef && !loadedAudioUrl) {
      setIsLoading(true);
      
      // Cancel any previous requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController();
      
      try {
        const response = await axios.get(`/api/quran/audio/${ayahRef}`, {
          signal: abortControllerRef.current.signal
        });
        
        if (response.data && response.data.audio) {
          setLoadedAudioUrl(response.data.audio);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error loading audio:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePlayPause = () => {
    if (!loadedAudioUrl && !isLoading) {
      // Load audio if not loaded yet
      loadAudio();
      return;
    }
    
    if (audioRef.current && loadedAudioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play()
          .catch(error => {
            console.error("Error playing audio:", error);
          });
      }
    }
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
            className="flex items-center gap-2 text-primary hover:text-primary-dark"
            onClick={togglePlayPause}
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
