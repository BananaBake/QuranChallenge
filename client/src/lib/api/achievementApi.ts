import { 
  getAchievements as getLocalAchievements,
  getNewlyUnlockedAchievements,
  clearNewlyUnlockedIds,
  checkAchievementsProgress,
  type Achievement
} from '../trophyService';
export const achievementApi = {
  async getAllAchievements(): Promise<Achievement[]> {
    return getLocalAchievements();
  },
  async getNewAchievements(): Promise<Achievement[]> {
    return getNewlyUnlockedAchievements();
  },
  clearNewAchievementNotifications() {
    clearNewlyUnlockedIds();
  },
  async checkAchievementProgress(): Promise<Achievement[]> {
    return checkAchievementsProgress();
  }
};