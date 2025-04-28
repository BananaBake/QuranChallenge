import trophyData from '@/data/trophies.json';
import { getGameStats } from './localStorageService';
import { GameHistory } from '@shared/schema';

// Keys for local storage
const UNLOCKED_TROPHIES_KEY = 'quran_challenge_unlocked_trophies';
const TROPHY_PROGRESS_KEY = 'quran_challenge_trophy_progress';
const HIGH_SCORE_BEATS_KEY = 'quran_challenge_highscore_beats';
const NEWLY_UNLOCKED_KEY = 'quran_challenge_newly_unlocked';
const ACHIEVEMENTS_KEY = 'quran_challenge_achievements'; // Keep for backward compatibility

// Achievement definition type
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

// Store for newly unlocked achievements to show notifications
export interface TrophyProgress {
  [key: string]: string | number;
}

/**
 * Get unlocked trophy IDs from localStorage
 */
function getUnlockedTrophyIds(): string[] {
  const idsString = localStorage.getItem(UNLOCKED_TROPHIES_KEY);
  if (!idsString) return [];
  try {
    return JSON.parse(idsString);
  } catch (error) {
    console.error('Error parsing unlocked trophies from localStorage', error);
    return [];
  }
}

/**
 * Get trophy progress from localStorage
 */
function getTrophyProgress(): TrophyProgress {
  const progressString = localStorage.getItem(TROPHY_PROGRESS_KEY);
  if (!progressString) return {};
  try {
    return JSON.parse(progressString);
  } catch (error) {
    console.error('Error parsing trophy progress from localStorage', error);
    return {};
  }
}

/**
 * Save unlocked trophy IDs to localStorage
 */
function saveUnlockedTrophyIds(ids: string[]): void {
  localStorage.setItem(UNLOCKED_TROPHIES_KEY, JSON.stringify(ids));
}

/**
 * Save trophy progress to localStorage
 */
function saveTrophyProgress(progress: TrophyProgress): void {
  localStorage.setItem(TROPHY_PROGRESS_KEY, JSON.stringify(progress));
}

/**
 * Store newly unlocked trophy IDs temporarily for notifications
 */
function saveNewlyUnlockedIds(ids: string[]): void {
  const newlyUnlockedIds = [...getNewlyUnlockedIds(), ...ids];
  localStorage.setItem(NEWLY_UNLOCKED_KEY, JSON.stringify({
    ids: newlyUnlockedIds,
    timestamp: Date.now()
  }));
}

/**
 * Get newly unlocked trophy IDs for notifications
 */
function getNewlyUnlockedIds(): string[] {
  const newlyUnlockedString = localStorage.getItem(NEWLY_UNLOCKED_KEY);
  if (!newlyUnlockedString) return [];
  try {
    const data = JSON.parse(newlyUnlockedString);
    // Only return IDs if they were unlocked in the last 5 seconds
    if (Date.now() - data.timestamp < 5000) {
      return data.ids;
    }
    return [];
  } catch (error) {
    console.error('Error parsing newly unlocked trophies from localStorage', error);
    return [];
  }
}

/**
 * Clear newly unlocked trophies after showing notifications
 */
export function clearNewlyUnlockedIds(): void {
  localStorage.removeItem(NEWLY_UNLOCKED_KEY);
}

/**
 * Get all achievements with their current state
 */
export function getAchievements(): Achievement[] {
  const unlockedIds = getUnlockedTrophyIds();
  const progress = getTrophyProgress();
  
  return trophyData.map(trophy => {
    const isUnlocked = unlockedIds.includes(trophy.id);
    // Ensure currentProgress is a number
    const progressValue = progress[trophy.id];
    const currentProgress = typeof progressValue === 'number' ? progressValue : 0;
    
    return {
      id: trophy.id,
      title: trophy.title,
      description: trophy.description,
      icon: trophy.icon,
      unlocked: isUnlocked,
      progress: currentProgress,
      goal: trophy.goal,
      unlockedAt: isUnlocked ? progress[`${trophy.id}_unlockedAt`] as string : undefined
    };
  });
}

/**
 * Update trophy progress and check for newly unlocked trophies
 */
function updateTrophyProgress(
  trophyId: string, 
  currentValue: number, 
  goalValue: number
): boolean {
  const progress = getTrophyProgress();
  const unlockedIds = getUnlockedTrophyIds();
  
  // Get the existing progress value, ensure it's a number
  const existingProgress = progress[trophyId];
  let existingValue = 0;
  
  if (typeof existingProgress === 'number') {
    existingValue = existingProgress;
  } else if (typeof existingProgress === 'string') {
    // Try to parse the string as a number
    const parsed = parseInt(existingProgress, 10);
    if (!isNaN(parsed)) {
      existingValue = parsed;
    }
  }
  
  // Update progress with the max value
  progress[trophyId] = Math.max(existingValue, currentValue);
  
  // Check if trophy should be unlocked
  let isNewlyUnlocked = false;
  if (currentValue >= goalValue && !unlockedIds.includes(trophyId)) {
    unlockedIds.push(trophyId);
    progress[`${trophyId}_unlockedAt`] = new Date().toISOString();
    isNewlyUnlocked = true;
  }
  
  // Save changes
  saveTrophyProgress(progress);
  saveUnlockedTrophyIds(unlockedIds);
  
  return isNewlyUnlocked;
}

/**
 * Update achievements based on a completed game
 */
export function updateAchievements(newGame: GameHistory): Achievement[] {
  const stats = getGameStats();
  const newlyUnlockedIds: string[] = [];
  
  // Process achievements by type from trophyData
  trophyData.forEach(trophy => {
    let currentValue = 0;
    let shouldUpdate = false;
    
    switch (trophy.type) {
      case 'milestone':
        // First game achievement
        if (trophy.id === 'first_game') {
          currentValue = stats.totalGames > 0 ? 1 : 0;
          shouldUpdate = true;
        }
        break;
        
      case 'games_played':
        // Games played achievements
        currentValue = stats.totalGames;
        shouldUpdate = true;
        break;
        
      case 'trophy_collection':
        // Trophy collection achievements
        currentValue = getUnlockedTrophyIds().length;
        shouldUpdate = true;
        break;
        
      case 'identify_streak':
        // Identify Surah streak achievements
        if (newGame.gameType === 'identify_surah') {
          currentValue = newGame.score;
          shouldUpdate = true;
        }
        break;
        
      case 'ordering_streak':
        // Surah Ordering streak achievements
        if (newGame.gameType === 'surah_ordering') {
          currentValue = newGame.score;
          shouldUpdate = true;
        }
        break;
        
      case 'high_score':
        // High score beaten achievements
        currentValue = stats.highScoreBeatenCount;
        shouldUpdate = true;
        break;
    }
    
    if (shouldUpdate) {
      const isNewlyUnlocked = updateTrophyProgress(trophy.id, currentValue, trophy.goal);
      if (isNewlyUnlocked) {
        newlyUnlockedIds.push(trophy.id);
      }
    }
  });
  
  // Store newly unlocked trophy IDs for notifications
  if (newlyUnlockedIds.length > 0) {
    saveNewlyUnlockedIds(newlyUnlockedIds);
  }
  
  // Return achievement objects for newly unlocked trophies
  return getAchievements().filter(a => newlyUnlockedIds.includes(a.id));
}

/**
 * Get newly unlocked achievements (for showing notifications)
 */
export function getNewlyUnlockedAchievements(): Achievement[] {
  const newlyUnlockedIds = getNewlyUnlockedIds();
  if (newlyUnlockedIds.length === 0) return [];
  
  return getAchievements().filter(a => newlyUnlockedIds.includes(a.id));
}

/**
 * Save achievements to localStorage - compatibility function
 * @deprecated Use the new storage functions instead
 */
export function saveAchievements(achievements: Achievement[]): void {
  // Extract the unlocked IDs
  const unlockedIds = achievements
    .filter(a => a.unlocked)
    .map(a => a.id);
  
  // Extract progress values
  const progress: TrophyProgress = {};
  achievements.forEach(a => {
    if (a.progress !== undefined) {
      progress[a.id] = a.progress;
    }
    if (a.unlockedAt) {
      progress[`${a.id}_unlockedAt`] = a.unlockedAt;
    }
  });
  
  // Save the data using the new format
  saveUnlockedTrophyIds(unlockedIds);
  saveTrophyProgress(progress);
  
  // Also save in the old format for backward compatibility
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
}

/**
 * Check achievements progress for other situations (like app init)
 */
export function checkAchievementsProgress(): Achievement[] {
  const stats = getGameStats();
  const newlyUnlockedIds: string[] = [];
  
  // Process achievements by type from trophyData
  trophyData.forEach(trophy => {
    let currentValue = 0;
    let shouldUpdate = false;
    
    switch (trophy.type) {
      case 'games_played':
        currentValue = stats.totalGames;
        shouldUpdate = true;
        break;
        
      case 'high_score':
        currentValue = stats.highScoreBeatenCount;
        shouldUpdate = true;
        break;
        
      case 'trophy_collection':
        currentValue = getUnlockedTrophyIds().length;
        shouldUpdate = true;
        break;
    }
    
    if (shouldUpdate) {
      const isNewlyUnlocked = updateTrophyProgress(trophy.id, currentValue, trophy.goal);
      if (isNewlyUnlocked) {
        newlyUnlockedIds.push(trophy.id);
      }
    }
  });
  
  // Store newly unlocked trophy IDs for notifications
  if (newlyUnlockedIds.length > 0) {
    saveNewlyUnlockedIds(newlyUnlockedIds);
  }
  
  // Return achievement objects for newly unlocked trophies
  return getAchievements().filter(a => newlyUnlockedIds.includes(a.id));
}

/**
 * Increment high score beaten count
 */
export function incrementHighScoreBeatenCount(): number {
  const currentCount = parseInt(localStorage.getItem(HIGH_SCORE_BEATS_KEY) || '0');
  const newCount = currentCount + 1;
  localStorage.setItem(HIGH_SCORE_BEATS_KEY, newCount.toString());
  return newCount;
}