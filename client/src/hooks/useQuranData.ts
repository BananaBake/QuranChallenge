import { useQuery } from "@tanstack/react-query";
import { Surah, Ayah } from "@shared/schema";

export function useSurahs() {
  return useQuery<Surah[]>({
    queryKey: ['/api/quran/surahs'],
  });
}

export function useRandomAyahsForGame(count: number = 10) {
  return useQuery<Ayah[]>({
    queryKey: ['/api/quran/random-ayahs', count],
  });
}

export function useRandomSurahsForGame(count: number = 5) {
  return useQuery<Surah[]>({
    queryKey: ['/api/quran/random-surahs', count],
  });
}
