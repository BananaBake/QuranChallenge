import { 
  getAchievements as getLocalAchievements,
  getNewlyUnlockedAchievements,
  clearNewlyUnlockedIds,
  checkAchievementsProgress
} from '../trophyService';

export const achievementApi = {
  async getAllAchievements() {
    return getLocalAchievements();
  },
  async getNewAchievements() {
    return getNewlyUnlockedAchievements();
  },
  clearNewAchievementNotifications() {
    clearNewlyUnlockedIds();
  },
  async checkAchievementProgress() {
    return checkAchievementsProgress();
  }
};
