import { useQuery } from '@tanstack/react-query';
import { 
  getAchievements, 
  getNewlyUnlockedAchievements,
  saveAchievements,
  checkAchievementsProgress,
  incrementHighScoreBeatenCount,
  updateAchievements,
  type Achievement
} from '../lib/trophyService';
import { GameHistory } from '@shared/schema';

/**
 * Hook to fetch all achievements
 */
export function useAchievements() {
  return useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: () => {
      try {
        const achievements = getAchievements();
        return achievements;
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
 * @returns Function to check achievement progress and show achievement notifications
 */
export function useAchievementNotifications() {
  const showAchievementNotifications = (_achievements: Achievement[]) => {
  };
  
  const checkForNewAchievements = () => {
    const newAchievements = getNewlyUnlockedAchievements();
    if (newAchievements.length > 0) {
      showAchievementNotifications(newAchievements);
    }
    return newAchievements;
  };
  
  const checkProgress = () => {
    const newAchievements = checkAchievementsProgress();
    if (newAchievements.length > 0) {
      showAchievementNotifications(newAchievements);
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
    
    const newCount = incrementHighScoreBeatenCount();
    
    const highScoreAchievements = checkAchievementsProgress();
    
    return highScoreAchievements.length > 0;
  };
  
  /**
   * Updates streak achievements during gameplay
   * @param gameType The type of game (identify_surah or surah_ordering)
   * @param score Current score/streak
   */
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
    
    const newlyUnlocked = updateAchievements(mockGame);
    
    return newlyUnlocked;
  };
  
  return {
    checkForNewAchievements,
    checkProgress,
    handleHighScoreAchievements,
    updateStreakAchievements
  };
}