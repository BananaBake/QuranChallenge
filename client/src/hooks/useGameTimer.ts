import { useState, useEffect } from 'react';

/**
 * Hook to manage game timer functionality
 * @param isRunning Whether the timer is running
 * @returns Timer state and controls
 */
export function useGameTimer(isRunning: boolean = false) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [formattedTime, setFormattedTime] = useState("00:00");
  
  // Start timer when isRunning becomes true
  useEffect(() => {
    if (isRunning && !startTime) {
      setStartTime(new Date());
    } else if (!isRunning && startTime) {
      // When stopped, keep the current time but stop the timer
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setTimeSpent(diff);
    }
  }, [isRunning, startTime]);
  
  // Timer update logic
  useEffect(() => {
    if (!startTime || !isRunning) return;
    
    const intervalId = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setTimeSpent(diff);
      
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setFormattedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [startTime, isRunning]);
  
  const resetTimer = () => {
    setStartTime(isRunning ? new Date() : null);
    setTimeSpent(0);
    setFormattedTime("00:00");
  };
  
  return {
    timeSpent,
    formattedTime,
    resetTimer
  };
}