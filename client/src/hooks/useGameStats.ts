import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GameStats, GameHistory } from "@shared/schema";
import { gameStatsApi } from "../lib/api";
export function useGameStats() {
  return useQuery<GameStats>({
    queryKey: ['gameStats'],
    queryFn: () => gameStatsApi.getGameStats(),
    staleTime: 60 * 1000 
  });
}
export function useRecentGames(limit: number = 5) {
  return useQuery<GameHistory[]>({
    queryKey: ['recentGames', limit],
    queryFn: () => gameStatsApi.getRecentGames(limit),
    staleTime: 60 * 1000 
  });
}
export function useSaveGameResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (gameData: {
      userId: number;
      gameType: string;
      score: number;
      maxScore: number;
      timeSpent: number;
    }) => {
      return gameStatsApi.saveGameResult(gameData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentGames'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
    onError: () => {
      if (window.showAlertMessage) {
        window.showAlertMessage({
          title: "Error",
          description: "Failed to save your game results",
          variant: "destructive",
        });
      }
    }
  });
}