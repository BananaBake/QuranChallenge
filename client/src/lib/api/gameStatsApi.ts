import { GameHistory, GameStats } from "@shared/schema";
import { getGameHistory, getGameStats as getLocalGameStats, saveGameHistory as saveLocalGameHistory } from "../localStorageService";
import { updateAchievements } from "../trophyService";
export const gameStatsApi = {
  async getGameStats(): Promise<GameStats> {
    return getLocalGameStats();
  },
  async getRecentGames(limit: number = 5): Promise<GameHistory[]> {
    const history = getGameHistory();
    return history.slice(0, limit);
  },
  async saveGameResult(gameData: {
    userId: number;
    gameType: string;
    score: number;
    maxScore: number;
    timeSpent: number;
  }): Promise<GameHistory> {
    const savedGame = saveLocalGameHistory(gameData);
    updateAchievements(savedGame);
    return savedGame;
  }
};