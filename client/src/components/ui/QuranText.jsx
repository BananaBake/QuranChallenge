import React, { useState, useRef, useEffect } from "react"; // Added React import
import { ArabesqueBorder } from "./ArabesqueBorder.jsx";
import { Play, Pause, Loader2 } from "lucide-react";
import { Button } from "./button.jsx";
import axios from "axios";

function AudioButton({ isLoading, isPlaying, disabled, onClick }) {
  let icon;
  let text;
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

export function QuranText({ 
  arabicText,
  audioUrl,
  ayahRef
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const audioRef = useRef(null);
  const currentAyahRef = useRef(ayahRef);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (ayahRef !== currentAyahRef.current) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsPlaying(false);
      setIsLoading(false);
      setAudioError(null);
      currentAyahRef.current = ayahRef;
    }
  }, [ayahRef]);

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
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
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
    setIsLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    try {
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        setupAudioEvents(audio);
        audioRef.current = audio;
        await audio.play();
        setIsPlaying(true);
      } 
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
        } else {
          setAudioError("Audio not available for this ayah.");
        }
      } else {
        setAudioError("No audio source available.");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }
      if (error instanceof Error) {
        setAudioError(`Audio loading failed: ${error.message}`);
      } else {
        setAudioError("Failed to load audio. Please try again.");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const setupAudioEvents = (audio) => {
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });
    audio.addEventListener('pause', () => {
      setIsPlaying(false);
    });
    audio.addEventListener('error', () => {
      setAudioError("Failed to play audio file.");
      setIsPlaying(false);
    });
  };

  const hasAudioSource = audioUrl || ayahRef;

  return (
    <ArabesqueBorder className="mb-6">
      <div className="p-6">
        <div className="text-center text-2xl leading-relaxed mb-4 font-arabic text-primary">
          {arabicText}
        </div>
        {hasAudioSource && (
          <div className="flex justify-center">
            <AudioButton
              isLoading={isLoading}
              isPlaying={isPlaying}
              onClick={loadAndPlayAudio}
              disabled={!!audioError}
            />
          </div>
        )}
        {audioError && (
          <div className="mt-2 text-center text-sm text-red-600">
            {audioError}
          </div>
        )}
      </div>
    </ArabesqueBorder>
  );
}
