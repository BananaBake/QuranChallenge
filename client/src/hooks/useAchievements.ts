import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GameHistory } from '@shared/schema';
import { achievementApi } from '../lib/api';
import { type Achievement } from '../lib/trophyService';
import { incrementHighScoreBeatenCount } from '../lib/localStorageService';
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
  const handleHighScoreAchievements = (currentScore: number, previousHighScore: number) => {
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
  const updateStreakAchievements = (gameType: string, score: number) => {
    const mockGame: GameHistory = {
      id: Date.now(),
      userId: 1,
      gameType,
      score,
      maxScore: score,
      timeSpent: 0,
      completedAt: new Date()
    };
    return []; 
  };
  return {
    checkForNewAchievements,
    checkProgress,
    handleHighScoreAchievements,
    updateStreakAchievements
  };
}