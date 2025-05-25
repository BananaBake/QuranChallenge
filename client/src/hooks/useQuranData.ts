import { useQuery } from "@tanstack/react-query";
import { Surah, Ayah } from "@shared/schema";
import { quranApi } from "../lib/api";

/**
 * Query configuration options
 */
interface QuranDataConfig {
  staleTime?: number;
  retry?: number | boolean;
  refetchOnWindowFocus?: boolean;
}

/**
 * Hook to fetch all surahs
 */
export function useSurahs(config: QuranDataConfig = {}) {
  const { 
    staleTime = 1000 * 60 * 60, // 1 hour cache by default
    retry = 2,
    refetchOnWindowFocus = false 
  } = config;
  
  return useQuery<Surah[]>({
    queryKey: ['/api/quran/surahs'],
    queryFn: () => quranApi.getAllSurahs(),
    staleTime,
    retry,
    refetchOnWindowFocus
  });
}

/**
 * Hook to fetch random ayahs for the game
 */
export function useRandomAyahsForGame(count: number = 10, config: QuranDataConfig = {}) {
  const { 
    staleTime = 0, // No caching for random content
    retry = 3,
    refetchOnWindowFocus = false 
  } = config;
  
  return useQuery<Ayah[]>({
    queryKey: ['/api/quran/random-ayahs', count],
    queryFn: () => quranApi.getRandomAyahs(count),
    staleTime,
    retry,
    refetchOnWindowFocus
  });
}

/**
 * Hook to fetch random surahs for the game
 */
export function useRandomSurahsForGame(count: number = 5, config: QuranDataConfig = {}) {
  const { 
    staleTime = 0, // No caching for random content
    retry = 3,
    refetchOnWindowFocus = false 
  } = config;
  
  return useQuery<Surah[]>({
    queryKey: ['/api/quran/random-surahs', count],
    queryFn: () => quranApi.getRandomSurahs(count),
    staleTime,
    retry,
    refetchOnWindowFocus
  });
}