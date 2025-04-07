import { useQuery } from "@tanstack/react-query";
import { Surah, Ayah } from "@shared/schema";

export function useSurahs() {
  return useQuery<Surah[]>({
    queryKey: ['/api/quran/surahs'],
  });
}

export function useRandomAyahsForGame(count: number = 10) {
  return useQuery<Ayah[]>({
    queryKey: ['/api/quran/random-ayahs', count, Math.random().toString()],
    refetchOnWindowFocus: false,
    queryFn: async ({ queryKey }) => {
      const response = await fetch(`/api/quran/random-ayahs?count=${count}&rand=${queryKey[2]}`);
      if (!response.ok) {
        throw new Error('Failed to fetch random ayahs');
      }
      return response.json();
    }
  });
}

export function useRandomSurahsForGame(count: number = 5) {
  return useQuery<Surah[]>({
    queryKey: ['/api/quran/random-surahs', count, Math.random().toString()],
    refetchOnWindowFocus: false,
    queryFn: async ({ queryKey }) => {
      const response = await fetch(`/api/quran/random-surahs?count=${count}&rand=${queryKey[2]}`);
      if (!response.ok) {
        throw new Error('Failed to fetch random surahs');
      }
      return response.json();
    }
  });
}
