import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GameStats, GameHistory } from "@shared/schema";
import { 
  getGameStats, 
  getRecentGameHistory, 
  saveGameHistory
} from "../lib/localStorageService";
import { getNewlyUnlockedAchievements } from "../lib/trophyService";

export function useGameStats() {
  return useQuery<GameStats>({
    queryKey: ['gameStats'],
    queryFn: () => getGameStats(),
    staleTime: 60 * 1000 // 1 minute
  });
}

export function useRecentGames(limit: number = 5) {
  return useQuery<GameHistory[]>({
    queryKey: ['recentGames', limit],
    queryFn: () => getRecentGameHistory(limit),
    staleTime: 60 * 1000 // 1 minute
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
      const savedGame = saveGameHistory(gameData);
      
      
      return savedGame;
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
