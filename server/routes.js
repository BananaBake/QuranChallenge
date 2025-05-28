import { createServer } from "http";
import { storage } from "./storage.js"; // Added .js
import axios from "axios";
import { z } from "zod";
import { insertGameHistorySchema } from "../shared/schema.js"; // Adjusted path and added .js

// Constants
const QURAN_API_BASE_URL = "https://api.alquran.cloud/v1";
const DEFAULT_USER_ID = 1;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Simple cache implementation
const cache = {};

/**
 * Check if cache entry is valid
 */
function isCacheValid(key) {
  const entry = cache[key];
  if (!entry) return false;
  
  const now = Date.now();
  return now - entry.timestamp < CACHE_DURATION;
}

/**
 * Get cached data or fetch new data
 */
async function getCachedOrFetch(key, fetchFn) {
  // Return from cache if valid
  if (isCacheValid(key)) {
    return cache[key].data;
  }
  
  // Fetch new data
  const data = await fetchFn();
  
  // Cache the result
  cache[key] = {
    timestamp: Date.now(),
    data
  };
  
  return data;
}

/**
 * Quran API helper functions
 */
const quranAPI = {
  /**
   * Fetch all surahs from the Quran API
   */
  async fetchAllSurahs() {
    const cacheKey = 'all_surahs';
    
    return getCachedOrFetch(cacheKey, async () => {
      const response = await axios.get(`${QURAN_API_BASE_URL}/surah`);
      return response.data.data;
    });
  },

  /**
   * Fetch an ayah with its translation
   */
  async fetchAyahWithTranslation(surahNumber, ayahNumber) {
    const cacheKey = `ayah_${surahNumber}_${ayahNumber}`;
    
    return getCachedOrFetch(cacheKey, async () => {
      const ayahResponse = await axios.get(
        `${QURAN_API_BASE_URL}/ayah/${surahNumber}:${ayahNumber}/editions/quran-uthmani,en.asad`
      );
      
      if (ayahResponse.data.data?.length >= 2) {
        const arabicAyah = ayahResponse.data.data[0];
        const translationAyah = ayahResponse.data.data[1];
        return { arabicAyah, translationAyah };
      }
      return null;
    });
  },

  /**
   * Fetch the audio for an ayah
   */
  async fetchAyahAudio(surahNumber, ayahNumber) {
    const cacheKey = `audio_${surahNumber}_${ayahNumber}`;
    
    return getCachedOrFetch(cacheKey, async () => {
      const audioResponse = await axios.get(
        `${QURAN_API_BASE_URL}/ayah/${surahNumber}:${ayahNumber}/ar.alafasy`
      );
      
      if (audioResponse.data?.data) {
        return audioResponse.data.data;
      }
      return null;
    });
  },

  /**
   * Create an Ayah object from the API response data
   */
  createAyahObject(arabicAyah, translationAyah, surah, audioData = null) {
    return {
      number: arabicAyah.number,
      text: arabicAyah.text,
      translation: translationAyah.text,
      ...(audioData && { 
        audio: audioData.audio,
        audioSecondary: audioData.audioSecondary
      }),
      ayahRef: `${surah.number}:${arabicAyah.numberInSurah || arabicAyah.ayahNumber}`,
      surah: {
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName
      }
    };
  },
  
  /**
   * Get random ayahs for the game with error handling
   * @param count Number of ayahs to fetch
   * @param surahs List of all surahs
   */
  async getRandomAyahs(count, surahs) {
    const ayahs = [];
    const usedSurahs = new Set();
    
    while (ayahs.length < count && usedSurahs.size < surahs.length) {
      const availableSurahs = surahs.filter(s => !usedSurahs.has(s.number));
      const randomSurah = availableSurahs[Math.floor(Math.random() * availableSurahs.length)];
      const ayahNumber = Math.floor(Math.random() * randomSurah.numberOfAyahs) + 1;
      
      try {
        const result = await this.fetchAyahWithTranslation(randomSurah.number, ayahNumber);
        if (result) {
          const { arabicAyah, translationAyah } = result;
          let audioData = null;
          try {
            audioData = await this.fetchAyahAudio(randomSurah.number, ayahNumber);
          } catch (error) { /* Continue without audio */ }
          
          const ayahObject = this.createAyahObject(arabicAyah, translationAyah, randomSurah, audioData);
          ayahs.push(ayahObject);
          usedSurahs.add(randomSurah.number);
        }
      } catch (error) { /* Skip this ayah */ }
    }
    
    while (ayahs.length < count) {
      const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];
      const ayahNumber = Math.floor(Math.random() * randomSurah.numberOfAyahs) + 1;
      
      try {
        const result = await this.fetchAyahWithTranslation(randomSurah.number, ayahNumber);
        if (result) {
          const { arabicAyah, translationAyah } = result;
          const isDuplicate = ayahs.some(a => a.surah.number === randomSurah.number && a.ayahRef.endsWith(`:${ayahNumber}`));
          
          if (!isDuplicate) {
            let audioData = null;
            try {
              audioData = await this.fetchAyahAudio(randomSurah.number, ayahNumber);
            } catch (error) { /* Continue without audio */ }
            
            const ayahObject = this.createAyahObject(arabicAyah, translationAyah, randomSurah, audioData);
            ayahs.push(ayahObject);
          }
        }
      } catch (error) { /* Skip this ayah */ }
      
      if (ayahs.length > 0 && ayahs.length < count && ayahs.length === count - 1) { // Heuristic to prevent infinite loop
        break;
      }
    }
    return ayahs;
  },
  
  getRandomSurahs(count, allSurahs) {
    const randomSurahs = [];
    const usedIndices = new Set();
    while (randomSurahs.length < count && usedIndices.size < allSurahs.length) {
      const randomIndex = Math.floor(Math.random() * allSurahs.length);
      if (!usedIndices.has(randomIndex)) {
        randomSurahs.push(allSurahs[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }
    return randomSurahs;
  }
};

const statsHelpers = {
  calculateModePerformance(gameHistory, mode) {
    const modeGames = gameHistory.filter(g => g.gameType === mode);
    if (modeGames.length === 0) return 0;
    const totalModeScorePercentage = modeGames.reduce((sum, game) => sum + (game.score / game.maxScore) * 100, 0);
    return Math.round(totalModeScorePercentage / modeGames.length);
  },
  
  getHighScore(gameHistory, mode) {
    const modeGames = gameHistory.filter(g => g.gameType === mode);
    if (modeGames.length === 0) return 0;
    return Math.max(...modeGames.map(game => game.score));
  }
};

export async function registerRoutes(app) {
  const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  app.get("/api/quran/surahs", asyncHandler(async (req, res) => {
    const surahs = await quranAPI.fetchAllSurahs();
    res.json(surahs);
  }));
  
  app.get("/api/quran/random-ayahs", asyncHandler(async (req, res) => {
    const count = parseInt(req.query.count) || 10;
    const surahs = await quranAPI.fetchAllSurahs();
    const ayahs = await quranAPI.getRandomAyahs(count, surahs);
    res.json(ayahs);
  }));
  
  app.get("/api/quran/random-surahs", asyncHandler(async (req, res) => {
    const count = parseInt(req.query.count) || 5;
    const allSurahs = await quranAPI.fetchAllSurahs();
    const randomSurahs = quranAPI.getRandomSurahs(count, allSurahs);
    res.json(randomSurahs);
  }));

  app.get("/api/quran/audio/:ayahRef", asyncHandler(async (req, res) => {
    const { ayahRef } = req.params;
    if (!ayahRef || !ayahRef.includes(':')) {
      return res.status(400).json({ message: "Invalid ayah reference format. Expected 'surah:ayah'" });
    }
    const [surahNumber, ayahNumber] = ayahRef.split(':').map(Number);
    if (isNaN(surahNumber) || isNaN(ayahNumber)) {
      return res.status(400).json({ message: "Invalid ayah reference format. Expected numbers for surah and ayah." });
    }
    const audioData = await quranAPI.fetchAyahAudio(surahNumber, ayahNumber);
    if (audioData) {
      res.json({
        audio: audioData.audio,
        audioSecondary: audioData.audioSecondary
      });
    } else {
      res.status(404).json({ message: "Audio not found for this ayah" });
    }
  }));

  app.post("/api/game/history", asyncHandler(async (req, res) => {
    const validatedData = insertGameHistorySchema.parse(req.body);
    const savedGame = await storage.saveGameHistory(validatedData);
    res.status(201).json(savedGame);
  }));

  app.get("/api/game/history/recent", asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const userId = parseInt(req.query.userId) || DEFAULT_USER_ID;
    const games = await storage.getRecentGameHistory(userId, limit);
    res.json(games);
  }));

  app.get("/api/game/stats", asyncHandler(async (req, res) => {
    const userId = parseInt(req.query.userId) || DEFAULT_USER_ID;
    const gameHistory = await storage.getGameHistoryByUserId(userId);
    
    const totalGames = gameHistory.length;
    let totalScore = 0;
    gameHistory.forEach(game => { totalScore += game.score; });
    const averageScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
    
    const identifySurahBest = statsHelpers.getHighScore(gameHistory, 'identify_surah');
    const surahOrderingBest = statsHelpers.getHighScore(gameHistory, 'surah_ordering');
    const bestStreak = Math.max(identifySurahBest, surahOrderingBest);
    const ayatLearned = totalGames + Math.floor(bestStreak / 2); // Simple estimation
    
    const identifySurahPerformance = statsHelpers.calculateModePerformance(gameHistory, 'identify_surah');
    const surahOrderingPerformance = statsHelpers.calculateModePerformance(gameHistory, 'surah_ordering');
    
    const recentGames = gameHistory.slice(0, 5);
    
    res.json({
      totalGames,
      averageScore,
      bestStreak,
      ayatLearned,
      modePerformance: { identifySurah: identifySurahBest, surahOrdering: surahOrderingBest },
      modePercentages: { identifySurah: identifySurahPerformance, surahOrdering: surahOrderingPerformance },
      recentGames
    });
  }));

  const httpServer = createServer(app);
  return httpServer;
}