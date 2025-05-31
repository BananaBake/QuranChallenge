import { useState, useEffect, useCallback } from 'react';

export function useGameTimer(isRunning = false) {
  const [startTime, setStartTime] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [formattedTime, setFormattedTime] = useState("00:00");

  useEffect(() => {
    if (isRunning && !startTime) {
      setStartTime(new Date());
    } else if (!isRunning && startTime) {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setTimeSpent(diff);
    }
  }, [isRunning, startTime]);

  useEffect(() => {
    if (!startTime || !isRunning) return;
    const formatTime = (seconds) => {
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
