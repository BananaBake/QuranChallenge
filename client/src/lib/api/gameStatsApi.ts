import { GameHistory, GameStats } from "@shared/schema";
import { getGameHistory, getGameStats as getLocalGameStats, saveGameHistory as saveLocalGameHistory } from "../localStorageService";
import { updateAchievements } from "../trophyService";

/**
 * Game Statistics API service for managing game data
 */
export const gameStatsApi = {
  /**
   * Get all game stats
   */
  async getGameStats(): Promise<GameStats> {
    return getLocalGameStats();
  },

  /**
   * Get recent game history
   * @param limit Maximum number of recent games to return
   */
  async getRecentGames(limit: number = 5): Promise<GameHistory[]> {
    const history = getGameHistory();
    return history.slice(0, limit);
  },

  /**
   * Save a new game result
   * @param gameData Game data to save
   */
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