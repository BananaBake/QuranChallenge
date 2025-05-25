import { useState, useEffect, useCallback } from 'react';
import { useSaveGameResult, useGameStats } from './useGameStats';
import { useAchievementNotifications } from './useAchievements';
import { useGameTimer } from './useGameTimer';

export type GameMode = 'identify_surah' | 'surah_ordering';

interface GameStateProps {
  gameMode: GameMode;
  initialScore?: number;
}

/**
 * Hook to manage the core game state
 * @param props Game configuration props
 * @returns Game state and control functions
 */
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
  
  // Set previous high score when stats are loaded
  useEffect(() => {
    if (stats?.modePerformance) {
      const highScore = gameMode === 'identify_surah' 
        ? stats.modePerformance.identifySurah 
        : stats.modePerformance.surahOrdering;
      
      setPreviousHighScore(highScore || 0);
    }
  }, [stats, gameMode]);
  
  /**
   * Increment the game score
   * Checks for achievement progress when score increases
   */
  const incrementScore = useCallback(() => {
    setScore(prevScore => {
      const newScore = prevScore + 1;
      // Check for streak achievements
      updateStreakAchievements(gameMode, newScore);
      
      // Trigger achievement check
      window.dispatchEvent(new Event('gameComplete'));
      
      return newScore;
    });
  }, [gameMode, updateStreakAchievements]);
  
  /**
   * End the current game
   * Saves game results and checks for achievements
   */
  const endGame = useCallback(() => {
    saveGameResult({
      userId: 1,
      gameType: gameMode,
      score,
      maxScore: score,
      timeSpent
    });
    
    // Check for any achievements that might have been unlocked
    checkProgress();
    setGameEnded(true);
    
    // Trigger achievement display
    setTimeout(() => {
      window.dispatchEvent(new Event('gameComplete'));
    }, 300);
  }, [gameMode, score, timeSpent, saveGameResult, checkProgress]);
  
  /**
   * Check if the current score is a new high score
   * @param currentScore Optional score to check (defaults to current game score)
   * @returns Whether the score is a new high score
   */
  const checkHighScore = useCallback((currentScore = score) => {
    if (currentScore > previousHighScore) {
      setIsNewHighScore(true);
      handleHighScoreAchievements(currentScore, previousHighScore);
      
      // Trigger achievement display
      setTimeout(() => {
        window.dispatchEvent(new Event('gameComplete'));
      }, 200);
      
      return true;
    }
    return false;
  }, [score, previousHighScore, handleHighScoreAchievements]);
  
  /**
   * Reset the game state for a new game
   */
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