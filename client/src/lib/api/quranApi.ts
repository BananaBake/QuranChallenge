import { Surah, Ayah } from "@shared/schema";
import { apiRequest } from "../queryClient";

/**
 * Quran API service for fetching data from the server
 */
export const quranApi = {
  /**
   * Fetch all surahs
   */
  async getAllSurahs(): Promise<Surah[]> {
    return apiRequest<Surah[]>('/api/quran/surahs');
  },
  
  /**
   * Fetch random ayahs for the game
   * @param count Number of random ayahs to fetch
   */
  async getRandomAyahs(count: number = 10): Promise<Ayah[]> {
    return apiRequest<Ayah[]>(`/api/quran/random-ayahs?count=${count}`);
  },
  
  /**
   * Fetch random surahs for the game
   * @param count Number of random surahs to fetch
   */
  async getRandomSurahs(count: number = 5): Promise<Surah[]> {
    return apiRequest<Surah[]>(`/api/quran/random-surahs?count=${count}`);
  },
  
  /**
   * Fetch audio for a specific ayah
   * @param ayahRef Ayah reference in format "surah:ayah"
   */
  async getAyahAudio(ayahRef: string): Promise<{ audio: string, audioSecondary?: string[] }> {
    return apiRequest<{ audio: string, audioSecondary?: string[] }>(`/api/quran/audio/${ayahRef}`);
  }
};