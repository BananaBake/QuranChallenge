import { 
  getAchievements as getLocalAchievements,
  getNewlyUnlockedAchievements,
  clearNewlyUnlockedIds,
  checkAchievementsProgress,
  type Achievement
} from '../trophyService';

/**
 * Achievement API service for managing trophies and achievements
 */
export const achievementApi = {
  /**
   * Get all achievements with their current state
   */
  async getAllAchievements(): Promise<Achievement[]> {
    return getLocalAchievements();
  },

  /**
   * Get newly unlocked achievements
   */
  async getNewAchievements(): Promise<Achievement[]> {
    return getNewlyUnlockedAchievements();
  },

  /**
   * Clear notifications for newly unlocked achievements
   */
  clearNewAchievementNotifications() {
    clearNewlyUnlockedIds();
  },

  /**
   * Check for achievement progress and return any newly unlocked achievements
   */
  async checkAchievementProgress(): Promise<Achievement[]> {
    return checkAchievementsProgress();
  }
};