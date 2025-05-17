import { GameHistory, GameStats } from "@shared/schema";
import { updateAchievements, incrementHighScoreBeatenCount as incrementScoreBeaten } from './trophyService';

// Key for storing game history in localStorage
const GAME_HISTORY_KEY = 'quran_challenge_history';

// Initial stats
const initialStats: GameStats = {
  totalGames: 0,
  averageScore: 0,
  bestStreak: 0,
  ayatLearned: 0,
  modePerformance: {
    identifySurah: 0,
    surahOrdering: 0
  },
  highScoreBeatenCount: 0,
  recentGames: []
};

// Get game history from localStorage
export function getGameHistory(): GameHistory[] {
  const historyString = localStorage.getItem(GAME_HISTORY_KEY);
  if (!historyString) {
    return [];
  }
  
  try {
    return JSON.parse(historyString);
  } catch (error) {
    // If parsing fails, return empty array and reset corrupt data
    localStorage.removeItem(GAME_HISTORY_KEY);
    return [];
  }
}

// Save a new game history entry
export function saveGameHistory(game: {
  userId: number; // This is expected to be a valid number
  gameType: string;
  score: number;
  maxScore: number;
  timeSpent: number;
}): GameHistory {
  const history = getGameHistory();
  
  const newGame: GameHistory = {
    ...game,
    id: Date.now(), // Use timestamp as a simple unique ID
    completedAt: new Date()
  };
  
  // Add to beginning of array (most recent first)
  const updatedHistory = [newGame, ...history];
  
  // Limit history to last 50 games to prevent localStorage from getting too large
  const limitedHistory = updatedHistory.slice(0, 50);
  
  // Save to localStorage
  localStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(limitedHistory));

  // Update achievements
  updateAchievements(newGame);
  
  return newGame;
}

// Get recent game history
export function getRecentGameHistory(limit: number = 5): GameHistory[] {
  const history = getGameHistory();
  return history.slice(0, limit);
}

// Calculate game stats based on local history
export function getGameStats(): GameStats {
  const history = getGameHistory();
  
  if (history.length === 0) {
    return initialStats;
  }
  
  const totalGames = history.length;
  const scores = history.map(game => game.score);
  const averageScore = scores.reduce((a, b) => a + b, 0) / totalGames;
  
  // Calculate best streak for each mode
  let identifySurahBest = 0;
  let surahOrderingBest = 0;
  
  history.forEach(game => {
    if (game.gameType === 'identify_surah') {
      identifySurahBest = Math.max(identifySurahBest, game.score);
    } else if (game.gameType === 'surah_ordering') {
      surahOrderingBest = Math.max(surahOrderingBest, game.score);
    }
  });
  
  // Best streak overall
  const bestStreak = Math.max(identifySurahBest, surahOrderingBest);
  
  // Roughly estimate ayat learned (one per game plus bonus for streaks)
  const ayatLearned = totalGames + Math.floor(bestStreak / 2);
  
  // Get high score beaten count from localStorage or initialize to 0
  const highScoreBeatenCount = parseInt(localStorage.getItem('quran_challenge_highscore_beats') || '0');
  
  return {
    totalGames,
    averageScore,
    bestStreak,
    ayatLearned,
    modePerformance: {
      identifySurah: identifySurahBest,
      surahOrdering: surahOrderingBest
    },
    highScoreBeatenCount,
    recentGames: getRecentGameHistory()
  };
}

// Function to increment the high score beaten count
export function incrementHighScoreBeatenCount(): number {
  // Using the shared key from trophyService
  const HIGH_SCORE_BEATS_KEY = 'quran_challenge_highscore_beats';
  const currentCount = parseInt(localStorage.getItem(HIGH_SCORE_BEATS_KEY) || '0');
  const newCount = currentCount + 1;
  localStorage.setItem(HIGH_SCORE_BEATS_KEY, newCount.toString());
  return newCount;
}