import { getGameHistory, getGameStats as getLocalGameStats, saveGameHistory as saveLocalGameHistory } from "../localStorageService.js";
import { updateAchievements } from "../trophyService.js";

export const gameStatsApi = {
  async getGameStats() {
    return getLocalGameStats();
  },
  async getRecentGames(limit = 5) {
    const history = getGameHistory();
    return history.slice(0, limit);
  },
  async saveGameResult(gameData) {
    const savedGame = saveLocalGameHistory(gameData);
    updateAchievements(savedGame);
    return savedGame;
  }
};
