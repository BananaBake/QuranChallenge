import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gameStatsApi } from "../lib/api";

export function useGameStats() {
  return useQuery({
    queryKey: ['gameStats'],
    queryFn: () => gameStatsApi.getGameStats(),
    staleTime: 60 * 1000 
  });
}

export function useRecentGames(limit = 5) {
  return useQuery({
    queryKey: ['recentGames', limit],
    queryFn: () => gameStatsApi.getRecentGames(limit),
    staleTime: 60 * 1000 
  });
}

export function useSaveGameResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (gameData) => {
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
