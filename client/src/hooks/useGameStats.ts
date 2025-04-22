import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GameStats, GameHistory } from "@shared/schema";
import { 
  getGameStats, 
  getRecentGameHistory, 
  saveGameHistory,
  getNewlyUnlockedAchievements
} from "@/lib/localStorageService";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (gameData: Omit<GameHistory, 'id' | 'completedAt'>) => {
      const savedGame = saveGameHistory(gameData);
      
      const newAchievements = getNewlyUnlockedAchievements();
      
      if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
          toast({
            title: "🏆 Achievement Unlocked!",
            description: `${achievement.title}: ${achievement.description}`,
            variant: "default",
          });
        });
      }
      
      return savedGame;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentGames'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your game results",
        variant: "destructive",
      });
    }
  });
}
