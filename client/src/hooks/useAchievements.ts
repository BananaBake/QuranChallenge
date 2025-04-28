import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  getAchievements, 
  getNewlyUnlockedAchievements,
  saveAchievements,
  checkAchievementsProgress,
  incrementHighScoreBeatenCount,
  updateAchievements,
  type Achievement
} from '@/lib/trophyService';
import { GameHistory } from '@shared/schema';

/**
 * Hook to fetch all achievements
 */
export function useAchievements() {
  const { toast } = useToast();
  
  return useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: () => {
      try {
        const achievements = getAchievements();
        return achievements;
      } catch (error) {
        console.error('Error fetching achievements:', error);
        toast({
          title: "Error",
          description: "Could not load your achievements",
          variant: "destructive",
        });
        throw error;
      }
    }
  });
}

/**
 * Hook to check for newly unlocked achievements
 * @returns Function to check achievement progress and show toast notifications
 */
export function useAchievementNotifications() {
  const { toast } = useToast();
  
  const showAchievementNotifications = (achievements: Achievement[]) => {
    achievements.forEach(achievement => {
      toast({
        title: "🏆 Achievement Unlocked!",
        description: `${achievement.title}: ${achievement.description}`,
        variant: "default",
      });
    });
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
    
    // New high score achieved
    const newCount = incrementHighScoreBeatenCount();
    
    // Check for high score achievements
    const highScoreAchievements = checkAchievementsProgress();
    
    // Show notifications for high score related achievements
    highScoreAchievements
      .filter(a => a.id.startsWith('highscore_'))
      .forEach(achievement => {
        toast({
          title: "🏆 Achievement Unlocked!",
          description: `${achievement.title}: ${achievement.description}`,
          variant: "default",
        });
      });
    
    // Show the new high score toast
    toast({
      title: "New High Score!",
      description: `Congratulations! You've beaten your previous best of ${previousHighScore}!`,
      variant: "default",
    });
    
    return true;
  };
  
  /**
   * Updates streak achievements during gameplay
   * @param gameType The type of game (identify_surah or surah_ordering)
   * @param score Current score/streak
   */
  const updateStreakAchievements = (gameType: string, score: number) => {
    // Create a mock game to process through the normal achievement system
    const mockGame: GameHistory = {
      id: Date.now(),
      userId: 1,
      gameType,
      score,
      maxScore: score,
      timeSpent: 0,
      completedAt: new Date()
    };
    
    // Use the updated achievement system from trophyService
    const newlyUnlocked = updateAchievements(mockGame);
    
    // Return the newly unlocked achievements
    return newlyUnlocked;
  };
  
  return {
    checkForNewAchievements,
    checkProgress,
    handleHighScoreAchievements,
    updateStreakAchievements
  };
}