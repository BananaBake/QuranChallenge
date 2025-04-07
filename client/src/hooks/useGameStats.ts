import { useQuery, useMutation } from "@tanstack/react-query";
import { GameStats, InsertGameHistory, GameHistory } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { 
  getGameStats, 
  getRecentGameHistory, 
  saveGameHistory,
  getNewlyUnlockedAchievements
} from "@/lib/localStorageService";
import { useToast } from "@/hooks/use-toast";

// Use local storage instead of API for stats
export function useGameStats() {
  const { toast } = useToast();
  
  return useQuery<GameStats>({
    queryKey: ['gameStats'],
    queryFn: () => {
      try {
        const stats = getGameStats();
        return stats;
      } catch (error) {
        console.error('Error fetching game stats:', error);
        toast({
          title: "Error",
          description: "Could not load your game statistics",
          variant: "destructive",
        });
        throw error;
      }
    }
  });
}

// Use local storage for recent games
export function useRecentGames(limit: number = 5) {
  const { toast } = useToast();
  
  return useQuery<GameHistory[]>({
    queryKey: ['recentGames', limit],
    queryFn: () => {
      try {
        const games = getRecentGameHistory(limit);
        return games;
      } catch (error) {
        console.error('Error fetching recent games:', error);
        toast({
          title: "Error",
          description: "Could not load your recent games",
          variant: "destructive",
        });
        throw error;
      }
    }
  });
}

// Save game results to local storage
export function useSaveGameResult() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (gameData: Omit<GameHistory, 'id' | 'completedAt'>) => {
      try {
        // Save to localStorage instead of API
        const savedGame = saveGameHistory(gameData);
        
        // Check for newly unlocked achievements
        const newAchievements = getNewlyUnlockedAchievements();
        
        // Show notifications for newly unlocked achievements
        newAchievements.forEach(achievement => {
          toast({
            title: "🏆 Achievement Unlocked!",
            description: `${achievement.title}: ${achievement.description}`,
            variant: "default",
          });
        });
        
        return savedGame;
      } catch (error) {
        console.error('Error saving game:', error);
        toast({
          title: "Error",
          description: "Could not save your game results",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate local query keys
      queryClient.invalidateQueries({ queryKey: ['gameStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentGames'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    }
  });
}
