import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { z } from "zod";
import { insertGameHistorySchema } from "@shared/schema";
import type { Ayah, Surah } from "@shared/schema";

const QURAN_API_BASE_URL = "https://api.alquran.cloud/v1";
const DEFAULT_USER_ID = 1;

async function fetchAllSurahs(): Promise<Surah[]> {
  const response = await axios.get(`${QURAN_API_BASE_URL}/surah`);
  return response.data.data;
}

async function fetchAyahWithTranslation(surahNumber: number, ayahNumber: number) {
  const ayahResponse = await axios.get(
    `${QURAN_API_BASE_URL}/ayah/${surahNumber}:${ayahNumber}/editions/quran-uthmani,en.asad`
  );
  
  if (ayahResponse.data.data?.length >= 2) {
    const arabicAyah = ayahResponse.data.data[0];
    const translationAyah = ayahResponse.data.data[1];
    return { arabicAyah, translationAyah };
  }
  return null;
}

async function fetchAyahAudio(surahNumber: number, ayahNumber: number) {
  const audioResponse = await axios.get(
    `${QURAN_API_BASE_URL}/ayah/${surahNumber}:${ayahNumber}/ar.alafasy`
  );
  
  if (audioResponse.data?.data) {
    return audioResponse.data.data;
  }
  return null;
}

function createAyahObject(arabicAyah: any, translationAyah: any, surah: any, audioData: any = null): Ayah {
  return {
    number: arabicAyah.number,
    text: arabicAyah.text,
    translation: translationAyah.text,
    ...(audioData && { 
      audio: audioData.audio,
      audioSecondary: audioData.audioSecondary
    }),
    ayahRef: `${surah.number}:${arabicAyah.ayahNumber}`,
    surah: {
      number: surah.number,
      name: surah.name,
      englishName: surah.englishName
    }
  };
}

function calculateModePerformance(gameHistory: any[], mode: string): number {
  const modeGames = gameHistory.filter(g => g.gameType === mode);
  
  if (modeGames.length === 0) {
    return 0;
  }
  
  const totalModeScorePercentage = modeGames.reduce((sum: number, game: any) => {
    return sum + (game.score / game.maxScore) * 100;
  }, 0);
  
  return Math.round(totalModeScorePercentage / modeGames.length);
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/quran/surahs", async (req, res) => {
    try {
      const surahs = await fetchAllSurahs();
      res.json(surahs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Surah data" });
    }
  });
  
  app.get("/api/quran/random-ayahs", async (req, res) => {
    try {
      const surahs = await fetchAllSurahs();
      const count = parseInt(req.query.count as string) || 10;
      const ayahs = [];
      const usedSurahs = new Set();
      
      while (ayahs.length < count && usedSurahs.size < surahs.length) {
        const availableSurahs = surahs.filter(s => !usedSurahs.has(s.number));
        const randomSurah = availableSurahs[Math.floor(Math.random() * availableSurahs.length)];
        const ayahNumber = Math.floor(Math.random() * randomSurah.numberOfAyahs) + 1;
        
        try {
          const result = await fetchAyahWithTranslation(randomSurah.number, ayahNumber);
          if (result) {
            const { arabicAyah, translationAyah } = result;
            
            ayahs.push({
              number: arabicAyah.number,
              text: arabicAyah.text,
              translation: translationAyah.text,
              ayahRef: `${randomSurah.number}:${ayahNumber}`,
              surah: {
                number: randomSurah.number,
                name: randomSurah.name,
                englishName: randomSurah.englishName
              }
            });
            
            usedSurahs.add(randomSurah.number);
          }
        } catch (error) {
          console.error(`Error fetching ayah ${randomSurah.number}:${ayahNumber}`, error);
        }
      }
      
      while (ayahs.length < count) {
        const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];
        const ayahNumber = Math.floor(Math.random() * randomSurah.numberOfAyahs) + 1;
        
        try {
          const result = await fetchAyahWithTranslation(randomSurah.number, ayahNumber);
          if (result) {
            const { arabicAyah, translationAyah } = result;
            const isDuplicate = ayahs.some(a => a.number === arabicAyah.number);
            
            if (!isDuplicate) {
              try {
                const audioData = await fetchAyahAudio(randomSurah.number, ayahNumber);
                
                if (audioData) {
                  ayahs.push(createAyahObject(arabicAyah, translationAyah, randomSurah, audioData));
                } else {
                  ayahs.push(createAyahObject(arabicAyah, translationAyah, randomSurah));
                }
              } catch (error) {
                console.error(`Error fetching audio for ayah ${randomSurah.number}:${ayahNumber}`, error);
                ayahs.push(createAyahObject(arabicAyah, translationAyah, randomSurah));
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching ayah ${randomSurah.number}:${ayahNumber}`, error);
        }
      }
      
      res.json(ayahs);
    } catch (error) {
      console.error("Error fetching random ayahs:", error);
      res.status(500).json({ message: "Failed to fetch random Ayahs" });
    }
  });
  
  app.get("/api/quran/random-surahs", async (req, res) => {
    try {
      const allSurahs = await fetchAllSurahs();
      const count = parseInt(req.query.count as string) || 5;
      
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


  app.get("/api/quran/audio/:ayahRef", async (req, res) => {
    try {
      const { ayahRef } = req.params;
      
      if (!ayahRef || !ayahRef.includes(':')) {
        return res.status(400).json({ message: "Invalid ayah reference format. Expected 'surah:ayah'" });
      }
      
      const audioResponse = await axios.get(
        `${QURAN_API_BASE_URL}/ayah/${ayahRef}/ar.alafasy`
      );
      
      if (audioResponse.data?.data) {
        const audioData = audioResponse.data.data;
        res.json({
          audio: audioData.audio,
          audioSecondary: audioData.audioSecondary
        });
      } else {
        res.status(404).json({ message: "Audio not found for this ayah" });
      }
    } catch (error) {
      console.error(`Error fetching audio for ayah ${req.params.ayahRef}:`, error);
      res.status(500).json({ message: "Failed to fetch audio" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
