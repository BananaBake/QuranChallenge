import { useState, useEffect, useCallback } from 'react';
import { useSaveGameResult, useGameStats } from '@/hooks/useGameStats';
import { useAchievementNotifications } from '@/hooks/useAchievements';
import { useGameTimer } from '@/hooks/useGameTimer';
import { useToast } from '@/hooks/use-toast';

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
      updateStreakAchievements(gameMode, newScore);
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
  }, [gameMode, score, timeSpent, saveGameResult, checkProgress]);
  
  const checkHighScore = useCallback((currentScore = score) => {
    if (currentScore > previousHighScore) {
      setIsNewHighScore(true);
      handleHighScoreAchievements(currentScore, previousHighScore);
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