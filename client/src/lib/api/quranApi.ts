import { Surah, Ayah } from "@shared/schema";
import { apiRequest } from "../queryClient";
export const quranApi = {
  async getAllSurahs(): Promise<Surah[]> {
    return apiRequest<Surah[]>('/api/quran/surahs');
  },
  async getRandomAyahs(count: number = 10): Promise<Ayah[]> {
    return apiRequest<Ayah[]>(`/api/quran/random-ayahs?count=${count}`);
  },
  async getRandomSurahs(count: number = 5): Promise<Surah[]> {
    return apiRequest<Surah[]>(`/api/quran/random-surahs?count=${count}`);
  },
  async getAyahAudio(ayahRef: string): Promise<{ audio: string, audioSecondary?: string[] }> {
    return apiRequest<{ audio: string, audioSecondary?: string[] }>(`/api/quran/audio/${ayahRef}`);
  }
};