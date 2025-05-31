import { useQuery, useQueryClient } from '@tanstack/react-query';
import { achievementApi } from '../lib/api';
import { incrementHighScoreBeatenCount } from '../lib/localStorageService.js';

export function useAchievements() {
  return useQuery({
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

export function useAchievementNotifications() {
  const queryClient = useQueryClient();
  const checkForNewAchievements = async () => {
    const newAchievements = await achievementApi.getNewAchievements();
    return newAchievements;
  };

  const checkProgress = async () => {
    const newAchievements = await achievementApi.checkAchievementProgress();
    if (newAchievements.length > 0) {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    }
    return newAchievements;
  };

  const handleHighScoreAchievements = (currentScore, previousHighScore) => {
    if (currentScore <= previousHighScore) return false;
    incrementHighScoreBeatenCount();
    const highScoreAchievements = achievementApi.checkAchievementProgress();
    if (highScoreAchievements instanceof Promise) {
      highScoreAchievements.then(achievements => {
        if (achievements.length > 0) {
          queryClient.invalidateQueries({ queryKey: ['achievements'] });
        }
      });
    }
    return true;
  };

  const updateStreakAchievements = (gameType, score) => {
    const mockGame = {
      id: Date.now(),
      userId: 1,
      gameType,
      score,
      maxScore: score,
      timeSpent: 0,
      completedAt: new Date()
    };
    // The original function returned [], implying it might be placeholder or incomplete.
    // For now, preserving that behavior.
    // Potentially, this should interact with achievementApi similar to handleHighScoreAchievements
    // For example: achievementApi.updateStreakAchievements(mockGame);
    // and then invalidate queries if new achievements are unlocked.
    return []; 
  };

  return {
    checkForNewAchievements,
    checkProgress,
    handleHighScoreAchievements,
    updateStreakAchievements
  };
}
