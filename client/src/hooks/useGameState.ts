import { useState, useEffect } from 'react';
import { useSaveGameResult, useGameStats } from '@/hooks/useGameStats';
import { useAchievementNotifications } from '@/hooks/useAchievements';
import { useGameTimer } from '@/hooks/useGameTimer';
import { useToast } from '@/hooks/use-toast';
import { GameHistory } from '@shared/schema';

type GameMode = 'identify_surah' | 'surah_ordering';

interface GameStateProps {
  gameMode: GameMode;
  initialScore?: number;
}

/**
 * Hook to manage common game state logic across different game modes
 */
export function useGameState({ gameMode, initialScore = 0 }: GameStateProps) {
  // Game state
  const [score, setScore] = useState(initialScore);
  const [gameEnded, setGameEnded] = useState(false);
  const [previousHighScore, setPreviousHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  
  // External hooks
  const { data: stats } = useGameStats();
  const { mutate: saveGameResult } = useSaveGameResult();
  const { toast } = useToast();
  const { timeSpent, formattedTime, resetTimer } = useGameTimer(!gameEnded);
  const { 
    handleHighScoreAchievements,
    updateStreakAchievements,
    checkProgress
  } = useAchievementNotifications();
  
  // Get previous high score for this game mode when stats load
  useEffect(() => {
    if (stats && stats.modePerformance) {
      const highScore = gameMode === 'identify_surah' 
        ? stats.modePerformance.identifySurah 
        : stats.modePerformance.surahOrdering;
      
      setPreviousHighScore(highScore || 0);
    }
  }, [stats, gameMode]);
  
  // Increment score and check for achievements
  const incrementScore = () => {
    const newScore = score + 1;
    setScore(newScore);
    
    // Update streak-based achievements
    updateStreakAchievements(gameMode, newScore);
    
    return newScore;
  };
  
  // End the game and save results
  const endGame = () => {
    // Save the game result
    saveGameResult({
      userId: 1,
      gameType: gameMode,
      score,
      maxScore: score,
      timeSpent
    });
    
    // Check for game completion achievements
    const playedAchievements = checkProgress();
    
    // End the game
    setGameEnded(true);
  };
  
  // Check if new score is a high score
  const checkHighScore = (currentScore = score) => {
    if (currentScore > previousHighScore) {
      setIsNewHighScore(true);
      const isNewHigh = handleHighScoreAchievements(currentScore, previousHighScore);
      return true;
    }
    return false;
  };
  
  // Reset the game state
  const resetGame = () => {
    setScore(initialScore);
    setGameEnded(false);
    setIsNewHighScore(false);
    resetTimer();
  };
  
  return {
    // State
    score,
    gameEnded,
    previousHighScore,
    isNewHighScore,
    timeSpent,
    formattedTime,
    
    // Actions
    incrementScore,
    endGame,
    checkHighScore,
    resetGame
  };
}