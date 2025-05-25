import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GameHistory } from '@shared/schema';
import { achievementApi } from '../lib/api';
import { type Achievement } from '../lib/trophyService';
import { incrementHighScoreBeatenCount } from '../lib/localStorageService';

/**
 * Hook to fetch all achievements
 */
export function useAchievements() {
  return useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      try {
        return await achievementApi.getAllAchievements();
      } catch (error) {
        if (window.showAlertMessage) {
          window.showAlertMessage({
            title: "Error",
            description: "Could not load your achievements",
            variant: "destructive",
          });
        }
        throw error;
      }
    }
  });
}

/**
 * Hook to check for newly unlocked achievements
 * @returns Functions to check and manage achievement progress
 */
export function useAchievementNotifications() {
  const queryClient = useQueryClient();
  
  /**
   * Check for any newly unlocked achievements
   * @returns Array of newly unlocked achievements
   */
  const checkForNewAchievements = async () => {
    const newAchievements = await achievementApi.getNewAchievements();
    return newAchievements;
  };
  
  /**
   * Check for achievement progress and update any newly unlocked achievements
   * @returns Array of newly unlocked achievements
   */
  const checkProgress = async () => {
    const newAchievements = await achievementApi.checkAchievementProgress();
    
    if (newAchievements.length > 0) {
      // Invalidate achievements cache if new ones were unlocked
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    }
    
    return newAchievements;
  };
  
  /**
   * Handles high score achievements
   * @param currentScore Current game score
   * @param previousHighScore Previous high score to compare against
   * @returns Whether a new high score was achieved
   */
  const handleHighScoreAchievements = (currentScore: number, previousHighScore: number) => {
    if (currentScore <= previousHighScore) return false;
    
    // Increment the high score beaten count
    incrementHighScoreBeatenCount();
    
    // Check for any new achievements
    const highScoreAchievements = achievementApi.checkAchievementProgress();
    
    // If we got new achievements, invalidate the cache
    if (highScoreAchievements instanceof Promise) {
      highScoreAchievements.then(achievements => {
        if (achievements.length > 0) {
          queryClient.invalidateQueries({ queryKey: ['achievements'] });
        }
      });
    }
    
    return true;
  };
  
  /**
   * Updates streak achievements during gameplay
   * @param gameType The type of game (identify_surah or surah_ordering)
   * @param score Current score/streak
   * @returns Array of newly unlocked achievements
   */
  const updateStreakAchievements = (gameType: string, score: number) => {
    // Create a temporary game history object to check achievements
    const mockGame: GameHistory = {
      id: Date.now(),
      userId: 1,
      gameType,
      score,
      maxScore: score,
      timeSpent: 0,
      completedAt: new Date()
    };
    
    // This is a mutable operation that needs to be cleaned up
    // Ideally, we'd move all this logic to the server side
    return []; // This is a temporary solution until we refactor the achievement system
  };
  
  return {
    checkForNewAchievements,
    checkProgress,
    handleHighScoreAchievements,
    updateStreakAchievements
  };
}