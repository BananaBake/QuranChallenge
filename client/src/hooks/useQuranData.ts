import { useQuery } from "@tanstack/react-query";
import { Surah, Ayah } from "@shared/schema";

interface QuranDataConfig {
  staleTime?: number;
  retry?: number | boolean;
  refetchOnWindowFocus?: boolean;
}

export function useSurahs(config: QuranDataConfig = {}) {
  const { 
    staleTime = 1000 * 60 * 60, // 1 hour cache by default
    retry = 2,
    refetchOnWindowFocus = false 
  } = config;
  
  return useQuery<Surah[]>({
    queryKey: ['/api/quran/surahs'],
    staleTime,
    retry,
    refetchOnWindowFocus
  });
}

export function useRandomAyahsForGame(count: number = 10, config: QuranDataConfig = {}) {
  const { 
    staleTime = 0, // No caching for random content
    retry = 3,
    refetchOnWindowFocus = false 
  } = config;
  
  return useQuery<Ayah[]>({
    queryKey: ['/api/quran/random-ayahs', count],
    staleTime,
    retry,
    refetchOnWindowFocus
  });
}

export function useRandomSurahsForGame(count: number = 5, config: QuranDataConfig = {}) {
  const { 
    staleTime = 0, // No caching for random content
    retry = 3,
    refetchOnWindowFocus = false 
  } = config;
  
  return useQuery<Surah[]>({
    queryKey: ['/api/quran/random-surahs', count],
    staleTime,
    retry,
    refetchOnWindowFocus
  });
}
