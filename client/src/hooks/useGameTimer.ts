import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage game timer functionality
 * @param isRunning Whether the timer is running
 * @returns Timer state and controls
 */
export function useGameTimer(isRunning: boolean = false) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [formattedTime, setFormattedTime] = useState("00:00");
  
  // Start or pause the timer based on isRunning state
  useEffect(() => {
    if (isRunning && !startTime) {
      setStartTime(new Date());
    } else if (!isRunning && startTime) {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setTimeSpent(diff);
    }
  }, [isRunning, startTime]);
  
  // Update the timer display every second when running
  useEffect(() => {
    if (!startTime || !isRunning) return;
    
    const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    
    const intervalId = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setTimeSpent(diff);
      setFormattedTime(formatTime(diff));
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [startTime, isRunning]);
  
  // Reset the timer
  const resetTimer = useCallback(() => {
    setStartTime(isRunning ? new Date() : null);
    setTimeSpent(0);
    setFormattedTime("00:00");
  }, [isRunning]);
  
  return {
    timeSpent,
    formattedTime,
    resetTimer
  };
}