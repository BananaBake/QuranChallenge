import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { z } from "zod";
import { insertGameHistorySchema } from "@shared/schema";

// Quran API base URL
const QURAN_API_BASE_URL = "https://api.alquran.cloud/v1";

export async function registerRoutes(app: Express): Promise<Server> {
  // Quran data endpoints
  
  // Get all surahs
  app.get("/api/quran/surahs", async (req, res) => {
    try {
      const response = await axios.get(`${QURAN_API_BASE_URL}/surah`);
      res.json(response.data.data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Surah data" });
    }
  });
  
  // Get random ayahs for the identify surah game
  app.get("/api/quran/random-ayahs", async (req, res) => {
    try {
      // First get the list of all surahs to know the ranges
      const surahsResponse = await axios.get(`${QURAN_API_BASE_URL}/surah`);
      const surahs = surahsResponse.data.data;
      
      // Parse count parameter with a default of 10
      const count = parseInt(req.query.count as string) || 10;
      
      // Generate random ayahs - try to get diverse ayahs from different surahs
      const ayahs = [];
      const usedSurahs = new Set();
      
      // First attempt to get one from each surah
      while (ayahs.length < count && usedSurahs.size < surahs.length) {
        // Pick a random surah that hasn't been used yet
        const availableSurahs = surahs.filter(s => !usedSurahs.has(s.number));
        const randomSurah = availableSurahs[Math.floor(Math.random() * availableSurahs.length)];
        
        // Pick a random ayah from this surah
        const ayahNumber = Math.floor(Math.random() * randomSurah.numberOfAyahs) + 1;
        
        try {
          const ayahResponse = await axios.get(
            `${QURAN_API_BASE_URL}/ayah/${randomSurah.number}:${ayahNumber}/editions/quran-uthmani,en.asad`
          );
          
          if (ayahResponse.data.data && ayahResponse.data.data.length >= 2) {
            const arabicAyah = ayahResponse.data.data[0];
            const translationAyah = ayahResponse.data.data[1];
            
            ayahs.push({
              number: arabicAyah.number,
              text: arabicAyah.text,
              translation: translationAyah.text,
              surah: {
                number: randomSurah.number,
                name: randomSurah.name,
                englishName: randomSurah.englishName
              }
            });
            
            usedSurahs.add(randomSurah.number);
          }
        } catch (error) {
          // Skip this ayah if there's an error and try another one
          console.error(`Error fetching ayah ${randomSurah.number}:${ayahNumber}`, error);
        }
      }
      
      // If we still need more ayahs, pick from random surahs
      while (ayahs.length < count) {
        const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];
        const ayahNumber = Math.floor(Math.random() * randomSurah.numberOfAyahs) + 1;
        
        try {
          const ayahResponse = await axios.get(
            `${QURAN_API_BASE_URL}/ayah/${randomSurah.number}:${ayahNumber}/editions/quran-uthmani,en.asad`
          );
          
          if (ayahResponse.data.data && ayahResponse.data.data.length >= 2) {
            const arabicAyah = ayahResponse.data.data[0];
            const translationAyah = ayahResponse.data.data[1];
            
            // Check if this exact ayah is already included
            const isDuplicate = ayahs.some(a => a.number === arabicAyah.number);
            
            if (!isDuplicate) {
              ayahs.push({
                number: arabicAyah.number,
                text: arabicAyah.text,
                translation: translationAyah.text,
                surah: {
                  number: randomSurah.number,
                  name: randomSurah.name,
                  englishName: randomSurah.englishName
                }
              });
            }
          }
        } catch (error) {
          // Skip this ayah if there's an error and try another one
          console.error(`Error fetching ayah ${randomSurah.number}:${ayahNumber}`, error);
        }
      }
      
      res.json(ayahs);
    } catch (error) {
      console.error("Error fetching random ayahs:", error);
      res.status(500).json({ message: "Failed to fetch random Ayahs" });
    }
  });
  
  // Get random surahs for the ordering game
  app.get("/api/quran/random-surahs", async (req, res) => {
    try {
      const response = await axios.get(`${QURAN_API_BASE_URL}/surah`);
      const allSurahs = response.data.data;
      
      // Parse count parameter with a default of 5
      const count = parseInt(req.query.count as string) || 5;
      
      // Select random surahs
      const randomSurahs = [];
      const usedIndices = new Set();
      
      while (randomSurahs.length < count && usedIndices.size < allSurahs.length) {
        const randomIndex = Math.floor(Math.random() * allSurahs.length);
        
        if (!usedIndices.has(randomIndex)) {
          randomSurahs.push(allSurahs[randomIndex]);
          usedIndices.add(randomIndex);
        }
      }
      
      res.json(randomSurahs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch random Surahs" });
    }
  });
  
  // Stats endpoints
  
  // Get user statistics
  app.get("/api/stats", async (req, res) => {
    try {
      // For this prototype, we'll use user ID 1
      const userId = 1;
      
      // Get all game history for this user
      const gameHistory = await storage.getGameHistoryByUserId(userId);
      
      if (!gameHistory || gameHistory.length === 0) {
        return res.json({
          totalGames: 0,
          averageScore: 0,
          bestStreak: 0,
          ayatLearned: 0,
          modePerformance: {
            identifySurah: 0,
            surahOrdering: 0
          },
          recentGames: []
        });
      }
      
      // Calculate statistics
      const totalGames = gameHistory.length;
      
      // Calculate average score as a percentage
      const totalScorePercentage = gameHistory.reduce((sum, game) => {
        return sum + (game.score / game.maxScore) * 100;
      }, 0);
      const averageScore = Math.round(totalScorePercentage / totalGames);
      
      // Calculate best streak (consecutive correct answers)
      const chronologicalGames = [...gameHistory].sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
      
      // For simplicity, we'll count best streak as consecutive games with score >= 70%
      let currentStreak = 0;
      let bestStreak = 0;
      
      for (const game of chronologicalGames) {
        const scorePercentage = (game.score / game.maxScore) * 100;
        
        if (scorePercentage >= 70) {
          currentStreak++;
          bestStreak = Math.max(bestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      
      // Calculate total ayat learned (for simplicity, we'll count each correct answer in identify surah mode)
      const identifySurahGames = gameHistory.filter(g => g.gameType === "identify_surah");
      const ayatLearned = identifySurahGames.reduce((sum, game) => sum + game.score, 0);
      
      // Calculate performance by game mode
      const identifySurahPerformance = calculateModePerformance(gameHistory, "identify_surah");
      const surahOrderingPerformance = calculateModePerformance(gameHistory, "surah_ordering");
      
      res.json({
        totalGames,
        averageScore,
        bestStreak,
        ayatLearned,
        modePerformance: {
          identifySurah: identifySurahPerformance,
          surahOrdering: surahOrderingPerformance
        },
        recentGames: chronologicalGames.slice(0, 5) // Return 5 most recent games
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  
  // Get recent games
  app.get("/api/stats/recent", async (req, res) => {
    try {
      // For this prototype, we'll use user ID 1
      const userId = 1;
      
      // Parse limit parameter with a default of 5
      const limit = parseInt(req.query.limit as string) || 5;
      
      // Get recent game history for this user
      const gameHistory = await storage.getRecentGameHistory(userId, limit);
      
      res.json(gameHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent games" });
    }
  });
  
  // Save game result
  app.post("/api/stats/save", async (req, res) => {
    try {
      const validatedData = insertGameHistorySchema.parse(req.body);
      
      const gameHistory = await storage.saveGameHistory(validatedData);
      
      res.status(201).json(gameHistory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid game data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save game result" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to calculate performance for a specific game mode
function calculateModePerformance(gameHistory, mode) {
  const modeGames = gameHistory.filter(g => g.gameType === mode);
  
  if (modeGames.length === 0) {
    return 0;
  }
  
  const totalModeScorePercentage = modeGames.reduce((sum, game) => {
    return sum + (game.score / game.maxScore) * 100;
  }, 0);
  
  return Math.round(totalModeScorePercentage / modeGames.length);
}
