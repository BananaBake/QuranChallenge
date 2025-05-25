import { useQuery } from "@tanstack/react-query";
import { Surah, Ayah } from "@shared/schema";
import { quranApi } from "../lib/api";
interface QuranDataConfig {
  staleTime?: number;
  retry?: number | boolean;
  refetchOnWindowFocus?: boolean;
}
export function useSurahs(config: QuranDataConfig = {}) {
  const { 
    staleTime = 1000 * 60 * 60, 
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
export function useRandomAyahsForGame(count: number = 10, config: QuranDataConfig = {}) {
  const { 
    staleTime = 0, 
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
export function useRandomSurahsForGame(count: number = 5, config: QuranDataConfig = {}) {
  const { 
    staleTime = 0, 
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