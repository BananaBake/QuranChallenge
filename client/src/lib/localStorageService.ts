import { GameHistory, GameStats } from "@shared/schema";

// Key for storing game history in localStorage
const GAME_HISTORY_KEY = 'quran_challenge_history';
const ACHIEVEMENTS_KEY = 'quran_challenge_achievements';

// Achievement definitions
export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  goal?: number;
  unlockedAt?: string;
};

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
  recentGames: []
};

// Initial achievements
export const initialAchievements: Achievement[] = [
  {
    id: 'first_game',
    title: 'First Steps',
    description: 'Complete your first game',
    icon: '🎮',
    unlocked: false
  },
  {
    id: 'streak_5',
    title: 'Getting Good',
    description: 'Reach a streak of 5 in any game mode',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    goal: 5
  },
  {
    id: 'streak_10',
    title: 'Master',
    description: 'Reach a streak of 10 in any game mode',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    goal: 10
  },
  {
    id: 'games_10',
    title: 'Dedicated Student',
    description: 'Play 10 games',
    icon: '📚',
    unlocked: false,
    progress: 0,
    goal: 10
  },
  {
    id: 'identify_master',
    title: 'Surah Identifier',
    description: 'Reach a streak of 7 in Identify Surah mode',
    icon: '🔍',
    unlocked: false,
    progress: 0,
    goal: 7
  },
  {
    id: 'ordering_master',
    title: 'Order Master',
    description: 'Reach a streak of 7 in Surah Ordering mode',
    icon: '⚖️',
    unlocked: false,
    progress: 0,
    goal: 7
  }
];

// Get game history from localStorage
export function getGameHistory(): GameHistory[] {
  const historyString = localStorage.getItem(GAME_HISTORY_KEY);
  if (!historyString) {
    return [];
  }
  
  try {
    return JSON.parse(historyString);
  } catch (error) {
    console.error('Error parsing game history from localStorage', error);
    return [];
  }
}

// Save a new game history entry
export function saveGameHistory(game: Omit<GameHistory, 'id'>): GameHistory {
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
  
  return {
    totalGames,
    averageScore,
    bestStreak,
    ayatLearned,
    modePerformance: {
      identifySurah: identifySurahBest,
      surahOrdering: surahOrderingBest
    },
    recentGames: getRecentGameHistory()
  };
}

// Achievement related functions
export function getAchievements(): Achievement[] {
  const achievementsString = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (!achievementsString) {
    // Initialize achievements if none exist
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(initialAchievements));
    return initialAchievements;
  }
  
  try {
    return JSON.parse(achievementsString);
  } catch (error) {
    console.error('Error parsing achievements from localStorage', error);
    return initialAchievements;
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
}

export function updateAchievements(newGame: GameHistory): Achievement[] {
  const achievements = getAchievements();
  const stats = getGameStats();
  const updatedAchievements = [...achievements];
  
  // Array to track newly unlocked achievements in this function call
  const newlyUnlocked: Achievement[] = [];
  
  let hasChanges = false;
  
  // First game achievement
  const firstGameAchievement = updatedAchievements.find(a => a.id === 'first_game');
  if (firstGameAchievement && !firstGameAchievement.unlocked) {
    firstGameAchievement.unlocked = true;
    firstGameAchievement.unlockedAt = new Date().toISOString();
    hasChanges = true;
    newlyUnlocked.push({...firstGameAchievement});
  }
  
  // Games played achievement
  const gamesPlayedAchievement = updatedAchievements.find(a => a.id === 'games_10');
  if (gamesPlayedAchievement) {
    gamesPlayedAchievement.progress = stats.totalGames;
    if (stats.totalGames >= (gamesPlayedAchievement.goal || 10) && !gamesPlayedAchievement.unlocked) {
      gamesPlayedAchievement.unlocked = true;
      gamesPlayedAchievement.unlockedAt = new Date().toISOString();
      hasChanges = true;
      newlyUnlocked.push({...gamesPlayedAchievement});
    }
  }
  
  // Streak achievements
  const streak5Achievement = updatedAchievements.find(a => a.id === 'streak_5');
  if (streak5Achievement) {
    streak5Achievement.progress = stats.bestStreak;
    if (stats.bestStreak >= 5 && !streak5Achievement.unlocked) {
      streak5Achievement.unlocked = true;
      streak5Achievement.unlockedAt = new Date().toISOString();
      hasChanges = true;
      newlyUnlocked.push({...streak5Achievement});
    }
  }
  
  const streak10Achievement = updatedAchievements.find(a => a.id === 'streak_10');
  if (streak10Achievement) {
    streak10Achievement.progress = stats.bestStreak;
    if (stats.bestStreak >= 10 && !streak10Achievement.unlocked) {
      streak10Achievement.unlocked = true;
      streak10Achievement.unlockedAt = new Date().toISOString();
      hasChanges = true;
      newlyUnlocked.push({...streak10Achievement});
    }
  }
  
  // Mode-specific achievements
  if (newGame.gameType === 'identify_surah') {
    const identifyAchievement = updatedAchievements.find(a => a.id === 'identify_master');
    if (identifyAchievement) {
      identifyAchievement.progress = Math.max(identifyAchievement.progress || 0, newGame.score);
      if (newGame.score >= 7 && !identifyAchievement.unlocked) {
        identifyAchievement.unlocked = true;
        identifyAchievement.unlockedAt = new Date().toISOString();
        hasChanges = true;
        newlyUnlocked.push({...identifyAchievement});
      }
    }
  } else if (newGame.gameType === 'surah_ordering') {
    const orderingAchievement = updatedAchievements.find(a => a.id === 'ordering_master');
    if (orderingAchievement) {
      orderingAchievement.progress = Math.max(orderingAchievement.progress || 0, newGame.score);
      if (newGame.score >= 7 && !orderingAchievement.unlocked) {
        orderingAchievement.unlocked = true;
        orderingAchievement.unlockedAt = new Date().toISOString();
        hasChanges = true;
        newlyUnlocked.push({...orderingAchievement});
      }
    }
  }
  
  if (hasChanges) {
    saveAchievements(updatedAchievements);
  }
  
  // Return only the achievements unlocked during this specific function call
  return newlyUnlocked;
}

// Get newly unlocked achievements (for showing notifications)
export function getNewlyUnlockedAchievements(): Achievement[] {
  const achievements = getAchievements();
  const newlyUnlocked = achievements.filter(a => {
    if (!a.unlocked || !a.unlockedAt) return false;
    
    // Consider "newly unlocked" if it was unlocked in the last 5 seconds
    // Using a shorter time window to ensure the notification appears immediately
    const unlockTime = new Date(a.unlockedAt).getTime();
    const now = Date.now();
    return (now - unlockTime) < 5000; // 5 seconds
  });
  
  return newlyUnlocked;
}

// Check achievements at any time during gameplay to see if any have been newly unlocked
export function checkAchievementsProgress(): Achievement[] {
  const stats = getGameStats();
  const achievements = getAchievements();
  const updatedAchievements = [...achievements];
  
  // Array to track newly unlocked achievements in this function call
  const newlyUnlocked: Achievement[] = [];
  
  let hasChanges = false;
  
  // First game achievement
  const firstGameAchievement = updatedAchievements.find(a => a.id === 'first_game');
  if (firstGameAchievement && !firstGameAchievement.unlocked && stats.totalGames > 0) {
    firstGameAchievement.unlocked = true;
    firstGameAchievement.unlockedAt = new Date().toISOString();
    hasChanges = true;
    newlyUnlocked.push({...firstGameAchievement});
  }
  
  // Games played achievement
  const gamesPlayedAchievement = updatedAchievements.find(a => a.id === 'games_10');
  if (gamesPlayedAchievement) {
    gamesPlayedAchievement.progress = stats.totalGames;
    if (stats.totalGames >= (gamesPlayedAchievement.goal || 10) && !gamesPlayedAchievement.unlocked) {
      gamesPlayedAchievement.unlocked = true;
      gamesPlayedAchievement.unlockedAt = new Date().toISOString();
      hasChanges = true;
      newlyUnlocked.push({...gamesPlayedAchievement});
    }
  }
  
  // Streak achievements
  const streak5Achievement = updatedAchievements.find(a => a.id === 'streak_5');
  if (streak5Achievement) {
    streak5Achievement.progress = stats.bestStreak;
    if (stats.bestStreak >= 5 && !streak5Achievement.unlocked) {
      streak5Achievement.unlocked = true;
      streak5Achievement.unlockedAt = new Date().toISOString();
      hasChanges = true;
      newlyUnlocked.push({...streak5Achievement});
    }
  }
  
  const streak10Achievement = updatedAchievements.find(a => a.id === 'streak_10');
  if (streak10Achievement) {
    streak10Achievement.progress = stats.bestStreak;
    if (stats.bestStreak >= 10 && !streak10Achievement.unlocked) {
      streak10Achievement.unlocked = true;
      streak10Achievement.unlockedAt = new Date().toISOString();
      hasChanges = true;
      newlyUnlocked.push({...streak10Achievement});
    }
  }
  
  // Mode-specific achievements based on stats
  const identifyAchievement = updatedAchievements.find(a => a.id === 'identify_master');
  if (identifyAchievement) {
    const maxIdentifyScore = Math.max(stats.modePerformance.identifySurah || 0, identifyAchievement.progress || 0);
    identifyAchievement.progress = maxIdentifyScore;
    if (maxIdentifyScore >= 7 && !identifyAchievement.unlocked) {
      identifyAchievement.unlocked = true;
      identifyAchievement.unlockedAt = new Date().toISOString();
      hasChanges = true;
      newlyUnlocked.push({...identifyAchievement});
    }
  }
  
  const orderingAchievement = updatedAchievements.find(a => a.id === 'ordering_master');
  if (orderingAchievement) {
    const maxOrderingScore = Math.max(stats.modePerformance.surahOrdering || 0, orderingAchievement.progress || 0);
    orderingAchievement.progress = maxOrderingScore;
    if (maxOrderingScore >= 7 && !orderingAchievement.unlocked) {
      orderingAchievement.unlocked = true;
      orderingAchievement.unlockedAt = new Date().toISOString();
      hasChanges = true;
      newlyUnlocked.push({...orderingAchievement});
    }
  }
  
  if (hasChanges) {
    saveAchievements(updatedAchievements);
  }
  
  // Return only the achievements unlocked during this specific function call
  return newlyUnlocked;
}