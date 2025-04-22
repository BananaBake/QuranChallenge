import trophyData from '@/data/trophies.json';
import { getGameStats, getGameHistory } from './localStorageService';
import { GameHistory } from '@shared/schema';

// Keys for local storage
const ACHIEVEMENTS_KEY = 'quran_challenge_achievements';

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

// Initialize achievements from the trophy data
export function getInitialAchievements(): Achievement[] {
  return trophyData.map(trophy => ({
    id: trophy.id,
    title: trophy.title,
    description: trophy.description,
    icon: trophy.icon,
    unlocked: false,
    progress: 0,
    goal: trophy.goal
  }));
}

// Get achievements from localStorage or initialize if they don't exist
export function getAchievements(): Achievement[] {
  const achievementsString = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (!achievementsString) {
    // Initialize achievements if none exist
    const initialAchievements = getInitialAchievements();
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(initialAchievements));
    return initialAchievements;
  }
  
  try {
    const savedAchievements = JSON.parse(achievementsString);
    
    // Check if there are new trophies in trophyData that aren't in savedAchievements
    const savedIds = savedAchievements.map((a: Achievement) => a.id);
    const initialAchievements = getInitialAchievements();
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
    const initialAchievements = getInitialAchievements();
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(initialAchievements));
    return initialAchievements;
  }
}

// Save achievements to localStorage
export function saveAchievements(achievements: Achievement[]): void {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
}

// Update achievements based on a completed game
export function updateAchievements(newGame: GameHistory): Achievement[] {
  const achievements = getAchievements();
  const stats = getGameStats();
  const updatedAchievements = [...achievements];
  
  // Array to track newly unlocked achievements in this function call
  const newlyUnlocked: Achievement[] = [];
  
  let hasChanges = false;
  
  // Process achievements by type from trophyData
  trophyData.forEach(trophy => {
    const achievement = updatedAchievements.find(a => a.id === trophy.id);
    if (!achievement) return;
    
    switch (trophy.type) {
      case 'milestone':
        // First game achievement
        if (trophy.id === 'first_game' && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          hasChanges = true;
          newlyUnlocked.push({...achievement});
        }
        break;
        
      case 'games_played':
        // Games played achievements
        achievement.progress = stats.totalGames;
        if (stats.totalGames >= trophy.goal && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          hasChanges = true;
          newlyUnlocked.push({...achievement});
        }
        break;
        
      case 'trophy_collection':
        // Trophy collection achievements
        // Count how many trophies are already unlocked (excluding the ones we just unlocked)
        const unlockedCount = updatedAchievements.filter(a => 
          a.unlocked && !newlyUnlocked.some(nu => nu.id === a.id)
        ).length;
        
        // Add the newly unlocked achievements to the count
        const totalUnlocked = unlockedCount + newlyUnlocked.length;
        achievement.progress = totalUnlocked;
        
        if (totalUnlocked >= trophy.goal && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          hasChanges = true;
          newlyUnlocked.push({...achievement});
        }
        break;
        
      case 'identify_streak':
        // Identify Surah streak achievements
        if (newGame.gameType === 'identify_surah') {
          const currentProgress = Math.max(achievement.progress || 0, newGame.score);
          achievement.progress = currentProgress;
          if (currentProgress >= trophy.goal && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
            hasChanges = true;
            newlyUnlocked.push({...achievement});
          }
        }
        break;
        
      case 'ordering_streak':
        // Surah Ordering streak achievements
        if (newGame.gameType === 'surah_ordering') {
          const currentProgress = Math.max(achievement.progress || 0, newGame.score);
          achievement.progress = currentProgress;
          if (currentProgress >= trophy.goal && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
            hasChanges = true;
            newlyUnlocked.push({...achievement});
          }
        }
        break;
        
      case 'high_score':
        // High score beaten achievements
        achievement.progress = stats.highScoreBeatenCount;
        if (stats.highScoreBeatenCount >= trophy.goal && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          hasChanges = true;
          newlyUnlocked.push({...achievement});
        }
        break;
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
  return achievements.filter(a => {
    if (!a.unlocked || !a.unlockedAt) return false;
    
    // Consider "newly unlocked" if it was unlocked in the last 5 seconds
    const unlockTime = new Date(a.unlockedAt).getTime();
    const now = Date.now();
    return (now - unlockTime) < 5000; // 5 seconds
  });
}

// Check achievements progress for other situations (like app init)
export function checkAchievementsProgress(): Achievement[] {
  const achievements = getAchievements();
  const stats = getGameStats();
  const updatedAchievements = [...achievements];
  
  // Array to track newly unlocked achievements
  const newlyUnlocked: Achievement[] = [];
  
  let hasChanges = false;
  
  // Process achievements by type from trophyData
  trophyData.forEach(trophy => {
    const achievement = updatedAchievements.find(a => a.id === trophy.id);
    if (!achievement || achievement.unlocked) return; // Skip already unlocked achievements
    
    switch (trophy.type) {
      case 'games_played':
        achievement.progress = stats.totalGames;
        if (stats.totalGames >= trophy.goal) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          hasChanges = true;
          newlyUnlocked.push({...achievement});
        }
        break;
        
      case 'high_score':
        achievement.progress = stats.highScoreBeatenCount;
        if (stats.highScoreBeatenCount >= trophy.goal) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          hasChanges = true;
          newlyUnlocked.push({...achievement});
        }
        break;
        
      case 'trophy_collection':
        const unlockedCount = updatedAchievements.filter(a => a.unlocked).length;
        achievement.progress = unlockedCount;
        if (unlockedCount >= trophy.goal) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          hasChanges = true;
          newlyUnlocked.push({...achievement});
        }
        break;
    }
  });
  
  if (hasChanges) {
    saveAchievements(updatedAchievements);
  }
  
  return newlyUnlocked;
}

// Increment high score beaten count
export function incrementHighScoreBeatenCount(): number {
  const currentCount = parseInt(localStorage.getItem('quran_challenge_highscore_beats') || '0');
  const newCount = currentCount + 1;
  localStorage.setItem('quran_challenge_highscore_beats', newCount.toString());
  return newCount;
}