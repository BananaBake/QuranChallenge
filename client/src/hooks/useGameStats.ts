import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { GameStats, InsertGameHistory, GameHistory } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export function useGameStats() {
  return useQuery<GameStats>({
    queryKey: ['/api/stats'],
  });
}

export function useRecentGames(limit: number = 5) {
  return useQuery<any>({
    queryKey: ['/api/stats/recent', limit],
  });
}

export function useSaveGameResult() {
  return useMutation({
    mutationFn: async (gameData: InsertGameHistory) => {
      const response = await apiRequest("POST", "/api/stats/save", gameData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats/recent'] });
    }
  });
}
