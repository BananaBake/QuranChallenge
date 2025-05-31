import { apiRequest } from "../queryClient.js";

export const quranApi = {
  async getAllSurahs() {
    return apiRequest('/api/quran/surahs');
  },
  async getRandomAyahs(count = 10) {
    return apiRequest(`/api/quran/random-ayahs?count=${count}`);
  },
  async getRandomSurahs(count = 5) {
    return apiRequest(`/api/quran/random-surahs?count=${count}`);
  },
  async getAyahAudio(ayahRef) {
    return apiRequest(`/api/quran/audio/${ayahRef}`);
  }
};
