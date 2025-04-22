import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  getAchievements, 
  getNewlyUnlockedAchievements,
  saveAchievements,
  checkAchievementsProgress,
  incrementHighScoreBeatenCount,
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
    const streakAchievements = getAchievements();
    let relevantAchievementIds: string[] = [];
    
    // Determine which achievement IDs to check based on game type
    if (gameType === 'identify_surah') {
      relevantAchievementIds = [
        'identify_master_5',
        'identify_master_10',
        'identify_streak_25',
        'identify_streak_50'
      ];
    } else if (gameType === 'surah_ordering') {
      relevantAchievementIds = [
        'ordering_master_5',
        'ordering_master_10',
        'ordering_streak_25',
        'ordering_streak_50'
      ];
    } else if (gameType === 'streak') {
      // General streak achievements
      relevantAchievementIds = ['streak_5', 'streak_10'];
    }
    
    const updatedAchievements = streakAchievements.map(achievement => {
      if (relevantAchievementIds.includes(achievement.id)) {
        const updatedAchievement = { ...achievement };
        // Update progress if current score is higher
        const currentProgress = Math.max(updatedAchievement.progress || 0, score);
        updatedAchievement.progress = currentProgress;
        
        // Check for unlock condition
        if (currentProgress >= (updatedAchievement.goal || 0) && !updatedAchievement.unlocked) {
          updatedAchievement.unlocked = true;
          updatedAchievement.unlockedAt = new Date().toISOString();
          
          // Show achievement notification
          toast({
            title: "🏆 Achievement Unlocked!",
            description: `${updatedAchievement.title}: ${updatedAchievement.description}`,
            variant: "default",
          });
        }
        return updatedAchievement;
      }
      return achievement;
    });
    
    // Save updated achievements
    saveAchievements(updatedAchievements);
    
    // Return newly unlocked achievements
    return updatedAchievements.filter(a => 
      relevantAchievementIds.includes(a.id) && 
      a.unlocked && 
      a.unlockedAt && 
      (new Date().getTime() - new Date(a.unlockedAt).getTime() < 5000)
    );
  };
  
  return {
    checkForNewAchievements,
    checkProgress,
    handleHighScoreAchievements,
    updateStreakAchievements
  };
}