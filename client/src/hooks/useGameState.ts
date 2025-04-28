import { useState, useEffect, useCallback } from 'react';
import { useSaveGameResult, useGameStats } from '@/hooks/useGameStats';
import { useAchievementNotifications } from '@/hooks/useAchievements';
import { useGameTimer } from '@/hooks/useGameTimer';

export type GameMode = 'identify_surah' | 'surah_ordering';

interface GameStateProps {
  gameMode: GameMode;
  initialScore?: number;
}

export function useGameState({ gameMode, initialScore = 0 }: GameStateProps) {
  const [score, setScore] = useState(initialScore);
  const [gameEnded, setGameEnded] = useState(false);
  const [previousHighScore, setPreviousHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  
  const { data: stats } = useGameStats();
  const { mutate: saveGameResult } = useSaveGameResult();
  const { timeSpent, formattedTime, resetTimer } = useGameTimer(!gameEnded);
  const { 
    handleHighScoreAchievements,
    updateStreakAchievements,
    checkProgress
  } = useAchievementNotifications();
  
  useEffect(() => {
    if (stats?.modePerformance) {
      const highScore = gameMode === 'identify_surah' 
        ? stats.modePerformance.identifySurah 
        : stats.modePerformance.surahOrdering;
      
      setPreviousHighScore(highScore || 0);
    }
  }, [stats, gameMode]);
  
  const incrementScore = useCallback(() => {
    setScore(prevScore => {
      const newScore = prevScore + 1;
      // Update streak achievements as score increases
      const newAchievements = updateStreakAchievements(gameMode, newScore);
      
      // Trigger achievement check if we got new achievements
      if (newAchievements.length > 0) {
        setTimeout(() => {
          window.dispatchEvent(new Event('gameComplete'));
        }, 100);
      }
      
      return newScore;
    });
  }, [gameMode, updateStreakAchievements]);
  
  const endGame = useCallback(() => {
    saveGameResult({
      userId: 1,
      gameType: gameMode,
      score,
      maxScore: score,
      timeSpent
    });
    
    checkProgress();
    setGameEnded(true);
    
    // Dispatch a game complete event to trigger achievement checks
    // Do this with a small delay to ensure the achievements are properly processed
    setTimeout(() => {
      console.log("Dispatching gameComplete event");
      window.dispatchEvent(new Event('gameComplete'));
    }, 300);
  }, [gameMode, score, timeSpent, saveGameResult, checkProgress]);
  
  const checkHighScore = useCallback((currentScore = score) => {
    if (currentScore > previousHighScore) {
      setIsNewHighScore(true);
      // Trigger high score achievement checks
      const isNewAchievement = handleHighScoreAchievements(currentScore, previousHighScore);
      
      // Trigger achievement notification if needed
      if (isNewAchievement) {
        setTimeout(() => {
          window.dispatchEvent(new Event('gameComplete'));
        }, 200);
      }
      
      return true;
    }
    return false;
  }, [score, previousHighScore, handleHighScoreAchievements]);
  
  const resetGame = useCallback(() => {
    setScore(initialScore);
    setGameEnded(false);
    setIsNewHighScore(false);
    resetTimer();
  }, [initialScore, resetTimer]);
  
  return {
    score,
    gameEnded,
    previousHighScore,
    isNewHighScore,
    timeSpent,
    formattedTime,
    incrementScore,
    endGame,
    checkHighScore,
    resetGame
  };
}