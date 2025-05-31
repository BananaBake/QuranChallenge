import { useQuery } from "@tanstack/react-query";
import { quranApi } from "../lib/api";

export function useSurahs(config = {}) {
  const { 
    staleTime = 1000 * 60 * 60, 
    retry = 2,
    refetchOnWindowFocus = false 
  } = config;
  return useQuery({
    queryKey: ['/api/quran/surahs'],
    queryFn: () => quranApi.getAllSurahs(),
    staleTime,
    retry,
    refetchOnWindowFocus
  });
}

export function useRandomAyahsForGame(count = 10, config = {}) {
  const { 
    staleTime = 0, 
    retry = 3,
    refetchOnWindowFocus = false 
  } = config;
  return useQuery({
    queryKey: ['/api/quran/random-ayahs', count],
    queryFn: () => quranApi.getRandomAyahs(count),
    staleTime,
    retry,
    refetchOnWindowFocus
  });
}

export function useRandomSurahsForGame(count = 5, config = {}) {
  const { 
    staleTime = 0, 
    retry = 3,
    refetchOnWindowFocus = false 
  } = config;
  return useQuery({
    queryKey: ['/api/quran/random-surahs', count],
    queryFn: () => quranApi.getRandomSurahs(count),
    staleTime,
    retry,
    refetchOnWindowFocus
  });
}
