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
  highScoreBeatenCount: 0,
  recentGames: []
};

// Initial achievements - ORDERED BY DIFFICULTY
export const initialAchievements: Achievement[] = [
  // -----------------------------------------------
  // ONE-TIME ACHIEVEMENTS (goal: 1)
  // -----------------------------------------------
  
  // First game achievement
  {
    id: 'first_game',
    title: 'First Steps',
    description: 'Complete your first game',
    icon: '🎮',
    unlocked: false
  },
  
  // First high score beaten
  {
    id: 'highscore_1',
    title: 'Record Breaker',
    description: 'Beat your high score for the first time',
    icon: '📈',
    unlocked: false,
    progress: 0,
    goal: 1
  },
  
  // -----------------------------------------------
  // GOAL: 5 ACHIEVEMENTS
  // -----------------------------------------------
  
  // Games played: 5
  {
    id: 'games_5',
    title: 'Getting Started',
    description: 'Play 5 games',
    icon: '📖',
    unlocked: false,
    progress: 0,
    goal: 5
  },
  
  // Unlock 5 trophies
  {
    id: 'trophies_5',
    title: 'Trophy Collector',
    description: 'Unlock 5 different achievements',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    goal: 5
  },
  
  // Identify Surah streak: 5
  {
    id: 'identify_master_5',
    title: 'Surah Novice',
    description: 'Reach a streak of 5 in Identify Surah mode',
    icon: '🔍',
    unlocked: false,
    progress: 0,
    goal: 5
  },
  
  // Surah Ordering streak: 5
  {
    id: 'ordering_master_5',
    title: 'Order Novice',
    description: 'Reach a streak of 5 in Surah Ordering mode',
    icon: '⚖️',
    unlocked: false,
    progress: 0,
    goal: 5
  },
  
  // High score beaten: 5 times
  {
    id: 'highscore_5',
    title: 'Consistent Improver',
    description: 'Beat your high score 5 times',
    icon: '📊',
    unlocked: false,
    progress: 0,
    goal: 5
  },
  
  // -----------------------------------------------
  // GOAL: 10 ACHIEVEMENTS
  // -----------------------------------------------
  
  // Games played: 10
  {
    id: 'games_10',
    title: 'Dedicated Student',
    description: 'Play 10 games',
    icon: '📚',
    unlocked: false,
    progress: 0,
    goal: 10
  },
  
  // Unlock 10 trophies
  {
    id: 'trophies_10',
    title: 'Trophy Master',
    description: 'Unlock 10 different achievements',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    goal: 10
  },
  
  // Identify Surah streak: 10
  {
    id: 'identify_master_10',
    title: 'Surah Master',
    description: 'Reach a streak of 10 in Identify Surah mode',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    goal: 10
  },
  
  // Surah Ordering streak: 10
  {
    id: 'ordering_master_10',
    title: 'Order Master',
    description: 'Reach a streak of 10 in Surah Ordering mode',
    icon: '📊',
    unlocked: false,
    progress: 0,
    goal: 10
  },
  
  // High score beaten: 10 times
  {
    id: 'highscore_10',
    title: 'Growth Mindset',
    description: 'Beat your high score 10 times',
    icon: '🚀',
    unlocked: false,
    progress: 0,
    goal: 10
  },
  
  // -----------------------------------------------
  // GOAL: 15+ ACHIEVEMENTS
  // -----------------------------------------------
  
  // Unlock 15 trophies
  {
    id: 'trophies_15',
    title: 'Trophy Expert',
    description: 'Unlock 15 different achievements',
    icon: '💫',
    unlocked: false,
    progress: 0,
    goal: 15
  },
  
  // Games played: 25
  {
    id: 'games_25',
    title: 'Regular Learner',
    description: 'Play 25 games',
    icon: '📝',
    unlocked: false,
    progress: 0,
    goal: 25
  },
  
  // Identify Surah streak: 25
  {
    id: 'identify_streak_25',
    title: 'Ayah Expert',
    description: 'Reach a streak of 25 in Identify Surah mode',
    icon: '📜',
    unlocked: false,
    progress: 0,
    goal: 25
  },
  
  // Surah Ordering streak: 25
  {
    id: 'ordering_streak_25',
    title: 'Sequencing Expert',
    description: 'Reach a streak of 25 in Surah Ordering mode',
    icon: '📋',
    unlocked: false,
    progress: 0,
    goal: 25
  },
  
  // High score beaten: 25 times
  {
    id: 'highscore_25',
    title: 'Continuous Learner',
    description: 'Beat your high score 25 times',
    icon: '📱',
    unlocked: false,
    progress: 0,
    goal: 25
  },
  
  // Unlock 20 trophies
  {
    id: 'trophies_20',
    title: 'Trophy Champion',
    description: 'Unlock 20 different achievements',
    icon: '🌟',
    unlocked: false,
    progress: 0,
    goal: 20
  },
  
  // Unlock 25 trophies
  {
    id: 'trophies_25',
    title: 'Trophy Legend',
    description: 'Unlock 25 different achievements',
    icon: '👑',
    unlocked: false,
    progress: 0,
    goal: 25
  },
  
  // Games played: 50
  {
    id: 'games_50',
    title: 'Knowledge Seeker',
    description: 'Play 50 games',
    icon: '🔖',
    unlocked: false,
    progress: 0,
    goal: 50
  },
  
  // Identify Surah streak: 50
  {
    id: 'identify_streak_50',
    title: 'Quran Navigator',
    description: 'Reach a streak of 50 in Identify Surah mode',
    icon: '🧭',
    unlocked: false,
    progress: 0,
    goal: 50
  },
  
  // Surah Ordering streak: 50
  {
    id: 'ordering_streak_50',
    title: 'Arrangement Guru',
    description: 'Reach a streak of 50 in Surah Ordering mode',
    icon: '🔄',
    unlocked: false,
    progress: 0,
    goal: 50
  },
  
  // High score beaten: 50 times
  {
    id: 'highscore_50',
    title: 'Excellence Pursuer',
    description: 'Beat your high score 50 times',
    icon: '🏅',
    unlocked: false,
    progress: 0,
    goal: 50
  },
  
  // Games played: 100
  {
    id: 'games_100',
    title: 'Scholar',
    description: 'Play 100 games',
    icon: '🧠',
    unlocked: false,
    progress: 0,
    goal: 100
  },
  
  // High score beaten: 100 times
  {
    id: 'highscore_100',
    title: 'Mastery Achieved',
    description: 'Beat your high score 100 times',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    goal: 100
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

// Achievement related functions
export function getAchievements(): Achievement[] {
  const achievementsString = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (!achievementsString) {
    // Initialize achievements if none exist
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(initialAchievements));
    return initialAchievements;
  }
  
  try {
    const savedAchievements = JSON.parse(achievementsString);
    
    // Check if there are new achievements in initialAchievements that aren't in savedAchievements
    // This is crucial when we add new achievements to the app and users already have existing data
    const savedIds = savedAchievements.map((a: Achievement) => a.id);
    const newAchievements = initialAchievements.filter(a => !savedIds.includes(a.id));
    
    if (newAchievements.length > 0) {
      // We found new achievements! Add them to the saved list
      const updatedAchievements = [...savedAchievements, ...newAchievements];
      // Save the updated list
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updatedAchievements));
      return updatedAchievements;
    }
    
    return savedAchievements;
  } catch (error) {
    console.error('Error parsing achievements from localStorage', error);
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(initialAchievements));
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
  
  // Games played achievements
  const gameAchievements = [
    { id: 'games_5', goal: 5 },
    { id: 'games_10', goal: 10 },
    { id: 'games_25', goal: 25 },
    { id: 'games_50', goal: 50 },
    { id: 'games_100', goal: 100 }
  ];
  
  gameAchievements.forEach(({ id, goal }) => {
    const achievement = updatedAchievements.find(a => a.id === id);
    if (achievement) {
      achievement.progress = stats.totalGames;
      if (stats.totalGames >= goal && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        hasChanges = true;
        newlyUnlocked.push({...achievement});
      }
    }
  });
  
  // Trophy collection achievements
  // Count how many trophies are already unlocked (excluding the ones we just unlocked)
  const unlockedCount = updatedAchievements.filter(a => 
    a.unlocked && !newlyUnlocked.some(nu => nu.id === a.id)
  ).length;
  
  const trophyAchievements = [
    { id: 'trophies_5', goal: 5 },
    { id: 'trophies_10', goal: 10 },
    { id: 'trophies_15', goal: 15 },
    { id: 'trophies_20', goal: 20 },
    { id: 'trophies_25', goal: 25 }
  ];
  
  // We need to process these in order of smallest goal to largest
  trophyAchievements.forEach(({ id, goal }) => {
    const achievement = updatedAchievements.find(a => a.id === id);
    
    if (achievement) {
      // Add the newly unlocked achievements to the count for the next tier
      const totalUnlocked = unlockedCount + newlyUnlocked.length;
      achievement.progress = totalUnlocked;
      
      if (totalUnlocked >= goal && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        hasChanges = true;
        newlyUnlocked.push({...achievement});
      }
    }
  });
  
  // Mode-specific achievements
  if (newGame.gameType === 'identify_surah') {
    const identifyStreakAchievements = [
      { id: 'identify_master_5', goal: 5 },
      { id: 'identify_master_10', goal: 10 },
      { id: 'identify_streak_25', goal: 25 },
      { id: 'identify_streak_50', goal: 50 }
    ];
    
    identifyStreakAchievements.forEach(({ id, goal }) => {
      const achievement = updatedAchievements.find(a => a.id === id);
      if (achievement) {
        const currentProgress = Math.max(achievement.progress || 0, newGame.score);
        achievement.progress = currentProgress;
        if (currentProgress >= goal && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          hasChanges = true;
          newlyUnlocked.push({...achievement});
        }
      }
    });
  } 
  else if (newGame.gameType === 'surah_ordering') {
    const orderingStreakAchievements = [
      { id: 'ordering_master_5', goal: 5 },
      { id: 'ordering_master_10', goal: 10 },
      { id: 'ordering_streak_25', goal: 25 },
      { id: 'ordering_streak_50', goal: 50 }
    ];
    
    orderingStreakAchievements.forEach(({ id, goal }) => {
      const achievement = updatedAchievements.find(a => a.id === id);
      if (achievement) {
        const currentProgress = Math.max(achievement.progress || 0, newGame.score);
        achievement.progress = currentProgress;
        if (currentProgress >= goal && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          hasChanges = true;
          newlyUnlocked.push({...achievement});
        }
      }
    });
  }
  
  // High score beaten achievements
  const highScoreAchievements = [
    { id: 'highscore_1', goal: 1 },
    { id: 'highscore_5', goal: 5 },
    { id: 'highscore_10', goal: 10 },
    { id: 'highscore_25', goal: 25 },
    { id: 'highscore_50', goal: 50 },
    { id: 'highscore_100', goal: 100 }
  ];
  
  highScoreAchievements.forEach(({ id, goal }) => {
    const achievement = updatedAchievements.find(a => a.id === id);
    if (achievement) {
      achievement.progress = stats.highScoreBeatenCount;
      if (stats.highScoreBeatenCount >= goal && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        hasChanges = true;
        newlyUnlocked.push({...achievement});
      }
    }
  });
  
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

// Function to increment the high score beaten count
export function incrementHighScoreBeatenCount(): number {
  const currentCount = parseInt(localStorage.getItem('quran_challenge_highscore_beats') || '0');
  const newCount = currentCount + 1;
  localStorage.setItem('quran_challenge_highscore_beats', newCount.toString());
  return newCount;
}

// Check achievements at any time during gameplay to see if any have been newly unlocked
export function checkAchievementsProgress(): Achievement[] {
  // Force a fresh calculation of stats to ensure we have the latest data
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
  
  // Games played achievements
  const gameAchievements = [
    { id: 'games_5', goal: 5 },
    { id: 'games_10', goal: 10 },
    { id: 'games_25', goal: 25 },
    { id: 'games_50', goal: 50 },
    { id: 'games_100', goal: 100 }
  ];
  
  gameAchievements.forEach(({ id, goal }) => {
    const achievement = updatedAchievements.find(a => a.id === id);
    if (achievement) {
      achievement.progress = stats.totalGames;
      if (stats.totalGames >= goal && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        hasChanges = true;
        newlyUnlocked.push({...achievement});
      }
    }
  });
  
  // Trophy collection achievements
  // Count how many trophies are already unlocked (excluding the ones we just unlocked)
  const unlockedCount = updatedAchievements.filter(a => 
    a.unlocked && !newlyUnlocked.some(nu => nu.id === a.id)
  ).length;
  
  const trophyAchievements = [
    { id: 'trophies_5', goal: 5 },
    { id: 'trophies_10', goal: 10 },
    { id: 'trophies_15', goal: 15 },
    { id: 'trophies_20', goal: 20 },
    { id: 'trophies_25', goal: 25 }
  ];
  
  // We need to process these in order of smallest goal to largest
  trophyAchievements.forEach(({ id, goal }) => {
    const achievement = updatedAchievements.find(a => a.id === id);
    
    if (achievement) {
      // Add the newly unlocked achievements to the count for the next tier
      const totalUnlocked = unlockedCount + newlyUnlocked.length;
      achievement.progress = totalUnlocked;
      
      if (totalUnlocked >= goal && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        hasChanges = true;
        newlyUnlocked.push({...achievement});
      }
    }
  });
  
  // Identify Surah streak achievements
  const identifyStreakAchievements = [
    { id: 'identify_master_5', goal: 5 },
    { id: 'identify_master_10', goal: 10 },
    { id: 'identify_streak_25', goal: 25 },
    { id: 'identify_streak_50', goal: 50 }
  ];
  
  identifyStreakAchievements.forEach(({ id, goal }) => {
    const achievement = updatedAchievements.find(a => a.id === id);
    if (achievement) {
      const maxIdentifyScore = Math.max(stats.modePerformance.identifySurah || 0, achievement.progress || 0);
      achievement.progress = maxIdentifyScore;
      if (maxIdentifyScore >= goal && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        hasChanges = true;
        newlyUnlocked.push({...achievement});
      }
    }
  });
  
  // Surah Ordering streak achievements
  const orderingStreakAchievements = [
    { id: 'ordering_master_5', goal: 5 },
    { id: 'ordering_master_10', goal: 10 },
    { id: 'ordering_streak_25', goal: 25 },
    { id: 'ordering_streak_50', goal: 50 }
  ];
  
  orderingStreakAchievements.forEach(({ id, goal }) => {
    const achievement = updatedAchievements.find(a => a.id === id);
    if (achievement) {
      const maxOrderingScore = Math.max(stats.modePerformance.surahOrdering || 0, achievement.progress || 0);
      achievement.progress = maxOrderingScore;
      if (maxOrderingScore >= goal && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        hasChanges = true;
        newlyUnlocked.push({...achievement});
      }
    }
  });
  
  // High score beaten achievements
  const highScoreAchievements = [
    { id: 'highscore_1', goal: 1 },
    { id: 'highscore_5', goal: 5 },
    { id: 'highscore_10', goal: 10 },
    { id: 'highscore_25', goal: 25 },
    { id: 'highscore_50', goal: 50 },
    { id: 'highscore_100', goal: 100 }
  ];
  
  highScoreAchievements.forEach(({ id, goal }) => {
    const achievement = updatedAchievements.find(a => a.id === id);
    if (achievement) {
      achievement.progress = stats.highScoreBeatenCount;
      if (stats.highScoreBeatenCount >= goal && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        hasChanges = true;
        newlyUnlocked.push({...achievement});
      }
    }
  });
  
  if (hasChanges) {
    saveAchievements(updatedAchievements);
  }
  
  // Return only the achievements unlocked during this specific function call
  return newlyUnlocked;
}