import { useState, useEffect, useCallback } from 'react';
import { 
  getGameStats, 
  getRecentGameHistory, 
  saveGameHistory, 
  getAchievements,
  getNewlyUnlockedAchievements,
  type Achievement
} from '@/lib/localStorageService';
import { GameHistory, InsertGameHistory, GameStats } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

// Hook for retrieving game stats from localStorage
export function useGameStats() {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    try {
      const data = getGameStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching game stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return { data: stats, isLoading };
}

// Hook for retrieving recent games from localStorage
export function useRecentGames(limit: number = 5) {
  const [games, setGames] = useState<GameHistory[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    try {
      const data = getRecentGameHistory(limit);
      setGames(data);
    } catch (error) {
      console.error('Error fetching recent games:', error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);
  
  return { data: games, isLoading };
}

// Hook for saving game results to localStorage
export function useSaveGameResult() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  const saveGameResult = useCallback((gameData: Omit<InsertGameHistory, 'id' | 'completedAt'>) => {
    setIsLoading(true);
    
    try {
      // Save to localStorage
      const savedGame = saveGameHistory(gameData);
      
      // No longer showing toast notifications here - we'll check for newly unlocked achievements in the game components
      // This way we can show the notifications during gameplay rather than all at the end
      
      return savedGame;
    } catch (error) {
      console.error('Error saving game result:', error);
      toast({
        title: "Error",
        description: "Failed to save your game result.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  return {
    mutate: saveGameResult,
    isPending: isLoading
  };
}

// Hook for achievements
export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    try {
      const data = getAchievements();
      setAchievements(data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const refresh = useCallback(() => {
    try {
      const data = getAchievements();
      setAchievements(data);
    } catch (error) {
      console.error('Error refreshing achievements:', error);
    }
  }, []);
  
  return {
    data: achievements,
    isLoading,
    refresh
  };
}