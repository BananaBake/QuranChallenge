import { useState, useRef, useEffect } from "react";
import { ArabesqueBorder } from "./arabesque-border";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "./button";

interface QuranTextProps {
  arabicText: string;
  audioUrl?: string;
}

export function QuranText({ 
  arabicText,
  audioUrl
}: QuranTextProps) {
  console.log("QuranText rendered with audioUrl:", audioUrl); // Debug log
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element when component mounts
  useEffect(() => {
    console.log("QuranText useEffect triggered with audioUrl:", audioUrl); // Debug log
    
    if (audioUrl) {
      const audio = new Audio(audioUrl);
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
  }, [audioUrl]);

  const togglePlayPause = () => {
    console.log("Toggle play/pause clicked, audioRef:", audioRef.current); // Debug log
    
    if (audioRef.current) {
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
        
        {/* Forced display of audio button for debugging */}
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-primary hover:text-primary-dark"
            onClick={togglePlayPause}
            disabled={!audioUrl}
          >
            {isPlaying ? (
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
