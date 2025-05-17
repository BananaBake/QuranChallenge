import { GameHistory, GameStats } from "@shared/schema";
import { updateAchievements, incrementHighScoreBeatenCount as incrementScoreBeaten } from './trophyService';

const GAME_HISTORY_KEY = 'quran_challenge_history';

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

export function getGameHistory(): GameHistory[] {
  const historyString = localStorage.getItem(GAME_HISTORY_KEY);
  if (!historyString) {
    return [];
  }
  
  try {
    return JSON.parse(historyString);
  } catch (error) {
    localStorage.removeItem(GAME_HISTORY_KEY);
    return [];
  }
}

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
  
  const updatedHistory = [newGame, ...history];
  
  const limitedHistory = updatedHistory.slice(0, 50);
  
  localStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(limitedHistory));

  updateAchievements(newGame);
  
  return newGame;
}

export function getRecentGameHistory(limit: number = 5): GameHistory[] {
  const history = getGameHistory();
  return history.slice(0, limit);
}

export function getGameStats(): GameStats {
  const history = getGameHistory();
  
  if (history.length === 0) {
    return initialStats;
  }
  
  const totalGames = history.length;
  const scores = history.map(game => game.score);
  const averageScore = scores.reduce((a, b) => a + b, 0) / totalGames;
  
  let identifySurahBest = 0;
  let surahOrderingBest = 0;
  
  history.forEach(game => {
    if (game.gameType === 'identify_surah') {
      identifySurahBest = Math.max(identifySurahBest, game.score);
    } else if (game.gameType === 'surah_ordering') {
      surahOrderingBest = Math.max(surahOrderingBest, game.score);
    }
  });
  
  const bestStreak = Math.max(identifySurahBest, surahOrderingBest);
  
  const ayatLearned = totalGames + Math.floor(bestStreak / 2);
  
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

export function incrementHighScoreBeatenCount(): number {
  const HIGH_SCORE_BEATS_KEY = 'quran_challenge_highscore_beats';
  const currentCount = parseInt(localStorage.getItem(HIGH_SCORE_BEATS_KEY) || '0');
  const newCount = currentCount + 1;
  localStorage.setItem(HIGH_SCORE_BEATS_KEY, newCount.toString());
  return newCount;
}