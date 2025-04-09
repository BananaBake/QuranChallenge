import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Game history
export const gameHistory = pgTable("game_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  gameType: text("game_type").notNull(), // "identify_surah" or "surah_ordering"
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  timeSpent: integer("time_spent").notNull(), // in seconds
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const insertGameHistorySchema = createInsertSchema(gameHistory).pick({
  userId: true,
  gameType: true,
  score: true,
  maxScore: true,
  timeSpent: true,
});

export type InsertGameHistory = z.infer<typeof insertGameHistorySchema>;
export type GameHistory = typeof gameHistory.$inferSelect;

// Surah data type (this will be fetched from an API, not stored in DB)
export type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

// Ayah data type (this will be fetched from an API, not stored in DB)
export type Ayah = {
  number: number;
  text: string;
  translation: string;
  audio?: string;
  audioSecondary?: string[];
  ayahRef?: string; // Format: surah:ayah (e.g., "1:1")
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
};

// Game statistics type
export type GameStats = {
  totalGames: number;
  averageScore: number;
  bestStreak: number;
  ayatLearned: number;
  modePerformance: {
    identifySurah: number;
    surahOrdering: number;
  };
  highScoreBeatenCount: number;
  recentGames: GameHistory[];
};
