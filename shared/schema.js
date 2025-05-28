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
