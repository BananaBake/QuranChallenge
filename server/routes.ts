import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { z } from "zod";
import { insertGameHistorySchema } from "@shared/schema";
import type { Ayah, Surah } from "@shared/schema";

// Constants
const QURAN_API_BASE_URL = "https://api.alquran.cloud/v1";
const DEFAULT_USER_ID = 1;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Simple cache implementation
interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

const cache: { [key: string]: CacheEntry<any> } = {};

/**
 * Check if cache entry is valid
 */
function isCacheValid<T>(key: string): boolean {
  const entry = cache[key] as CacheEntry<T>;
  if (!entry) return false;
  
  const now = Date.now();
  return now - entry.timestamp < CACHE_DURATION;
}

/**
 * Get cached data or fetch new data
 */
async function getCachedOrFetch<T>(
  key: string, 
  fetchFn: () => Promise<T>
): Promise<T> {
  // Return from cache if valid
  if (isCacheValid<T>(key)) {
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
  async fetchAllSurahs(): Promise<Surah[]> {
    const cacheKey = 'all_surahs';
    
    return getCachedOrFetch<Surah[]>(cacheKey, async () => {
      const response = await axios.get(`${QURAN_API_BASE_URL}/surah`);
      return response.data.data;
    });
  },

  /**
   * Fetch an ayah with its translation
   */
  async fetchAyahWithTranslation(surahNumber: number, ayahNumber: number) {
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
  async fetchAyahAudio(surahNumber: number, ayahNumber: number) {
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
  createAyahObject(arabicAyah: any, translationAyah: any, surah: any, audioData: any = null): Ayah {
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
  async getRandomAyahs(count: number, surahs: Surah[]): Promise<Ayah[]> {
    const ayahs: Ayah[] = [];
    const usedSurahs = new Set<number>();
    
    // Try to get ayahs from different surahs first
    while (ayahs.length < count && usedSurahs.size < surahs.length) {
      // Get random surah that hasn't been used yet
      const availableSurahs = surahs.filter(s => !usedSurahs.has(s.number));
      const randomSurah = availableSurahs[Math.floor(Math.random() * availableSurahs.length)];
      
      // Get random ayah from this surah
      const ayahNumber = Math.floor(Math.random() * randomSurah.numberOfAyahs) + 1;
      
      try {
        const result = await this.fetchAyahWithTranslation(randomSurah.number, ayahNumber);
        if (result) {
          const { arabicAyah, translationAyah } = result;
          
          // Try to fetch audio data
          let audioData = null;
          try {
            audioData = await this.fetchAyahAudio(randomSurah.number, ayahNumber);
          } catch (error) {
            // Continue without audio if fetch fails
          }
          
          // Create the ayah object
          const ayahObject = this.createAyahObject(
            arabicAyah, 
            translationAyah, 
            randomSurah,
            audioData
          );
          
          ayahs.push(ayahObject);
          usedSurahs.add(randomSurah.number);
        }
      } catch (error) {
        // Skip this ayah and try another
      }
    }
    
    // If we still need more ayahs, get them from any surah
    while (ayahs.length < count) {
      const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];
      const ayahNumber = Math.floor(Math.random() * randomSurah.numberOfAyahs) + 1;
      
      try {
        const result = await this.fetchAyahWithTranslation(randomSurah.number, ayahNumber);
        if (result) {
          const { arabicAyah, translationAyah } = result;
          
          // Check if this ayah is already included
          const isDuplicate = ayahs.some(a => 
            a.surah.number === randomSurah.number && 
            a.ayahRef.endsWith(`:${ayahNumber}`)
          );
          
          if (!isDuplicate) {
            // Try to fetch audio data
            let audioData = null;
            try {
              audioData = await this.fetchAyahAudio(randomSurah.number, ayahNumber);
            } catch (error) {
              // Continue without audio if fetch fails
            }
            
            // Create the ayah object
            const ayahObject = this.createAyahObject(
              arabicAyah, 
              translationAyah, 
              randomSurah,
              audioData
            );
            
            ayahs.push(ayahObject);
          }
        }
      } catch (error) {
        // Skip this ayah and try another
      }
      
      // Prevent infinite loop if we can't get enough ayahs
      if (ayahs.length > 0 && ayahs.length < count && ayahs.length === count - 1) {
        break;
      }
    }
    
    return ayahs;
  },
  
  /**
   * Get random surahs for the game
   * @param count Number of surahs to fetch
   * @param allSurahs List of all surahs
   */
  getRandomSurahs(count: number, allSurahs: Surah[]): Surah[] {
    const randomSurahs: Surah[] = [];
    const usedIndices = new Set<number>();
    
    // Keep adding random surahs until we have enough
    while (randomSurahs.length < count && usedIndices.size < allSurahs.length) {
      const randomIndex = Math.floor(Math.random() * allSurahs.length);
      
      // Make sure we don't add the same surah twice
      if (!usedIndices.has(randomIndex)) {
        randomSurahs.push(allSurahs[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }
    
    return randomSurahs;
  }
};

/**
 * Helper functions for game statistics
 */
const statsHelpers = {
  /**
   * Calculate performance percentage for a specific game mode
   */
  calculateModePerformance(gameHistory: any[], mode: string): number {
    const modeGames = gameHistory.filter(g => g.gameType === mode);
    
    if (modeGames.length === 0) {
      return 0;
    }
    
    // Calculate the average score percentage across all games of this mode
    const totalModeScorePercentage = modeGames.reduce((sum: number, game: any) => {
      return sum + (game.score / game.maxScore) * 100;
    }, 0);
    
    return Math.round(totalModeScorePercentage / modeGames.length);
  },
  
  /**
   * Get the highest score for a specific game mode
   */
  getHighScore(gameHistory: any[], mode: string): number {
    const modeGames = gameHistory.filter(g => g.gameType === mode);
    
    if (modeGames.length === 0) {
      return 0;
    }
    
    // Find the highest score
    return Math.max(...modeGames.map(game => game.score));
  }
};

/**
 * Register all API routes
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Error handler middleware
  const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
    (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  
  // Get all surahs
  app.get("/api/quran/surahs", asyncHandler(async (req, res) => {
    const surahs = await quranAPI.fetchAllSurahs();
    res.json(surahs);
  }));
  
  // Get random ayahs for the identify surah game
  app.get("/api/quran/random-ayahs", asyncHandler(async (req, res) => {
    const count = parseInt(req.query.count as string) || 10;
    const surahs = await quranAPI.fetchAllSurahs();
    const ayahs = await quranAPI.getRandomAyahs(count, surahs);
    res.json(ayahs);
  }));
  
  // Get random surahs for the surah ordering game
  app.get("/api/quran/random-surahs", asyncHandler(async (req, res) => {
    const count = parseInt(req.query.count as string) || 5;
    const allSurahs = await quranAPI.fetchAllSurahs();
    const randomSurahs = quranAPI.getRandomSurahs(count, allSurahs);
    res.json(randomSurahs);
  }));

  // Get audio for a specific ayah
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

  // Save game history
  app.post("/api/game/history", asyncHandler(async (req, res) => {
    const validatedData = insertGameHistorySchema.parse(req.body);
    const savedGame = await storage.saveGameHistory(validatedData);
    res.status(201).json(savedGame);
  }));

  // Get recent game history
  app.get("/api/game/history/recent", asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const userId = parseInt(req.query.userId as string) || DEFAULT_USER_ID;
    const games = await storage.getRecentGameHistory(userId, limit);
    res.json(games);
  }));

  // Get game statistics
  app.get("/api/game/stats", asyncHandler(async (req, res) => {
    const userId = parseInt(req.query.userId as string) || DEFAULT_USER_ID;
    const gameHistory = await storage.getGameHistoryByUserId(userId);
    
    // Calculate statistics
    const totalGames = gameHistory.length;
    
    // Calculate average score
    let totalScore = 0;
    let totalMaxScore = 0;
    
    gameHistory.forEach(game => {
      totalScore += game.score;
      totalMaxScore += game.maxScore;
    });
    
    const averageScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
    
    // Get highest scores for each mode
    const identifySurahBest = statsHelpers.getHighScore(gameHistory, 'identify_surah');
    const surahOrderingBest = statsHelpers.getHighScore(gameHistory, 'surah_ordering');
    
    // Calculate best streak across all games
    const bestStreak = Math.max(identifySurahBest, surahOrderingBest);
    
    // Calculate ayat learned (simple estimation)
    const ayatLearned = totalGames + Math.floor(bestStreak / 2);
    
    // Calculate performance percentages for each mode
    const identifySurahPerformance = statsHelpers.calculateModePerformance(gameHistory, 'identify_surah');
    const surahOrderingPerformance = statsHelpers.calculateModePerformance(gameHistory, 'surah_ordering');
    
    // Get recent games
    const recentGames = gameHistory.slice(0, 5);
    
    // Return stats
    res.json({
      totalGames,
      averageScore,
      bestStreak,
      ayatLearned,
      modePerformance: {
        identifySurah: identifySurahBest,
        surahOrdering: surahOrderingBest
      },
      modePercentages: {
        identifySurah: identifySurahPerformance,
        surahOrdering: surahOrderingPerformance
      },
      recentGames
    });
  }));

  const httpServer = createServer(app);
  return httpServer;
}