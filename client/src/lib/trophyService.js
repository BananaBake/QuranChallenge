import trophyData from '@/data/trophies.json';
import { getGameStats } from './localStorageService.js';

const UNLOCKED_TROPHIES_KEY = 'quran_challenge_unlocked_trophies';
const TROPHY_PROGRESS_KEY = 'quran_challenge_trophy_progress';
const HIGH_SCORE_BEATS_KEY = 'quran_challenge_highscore_beats';
const NEWLY_UNLOCKED_KEY = 'quran_challenge_newly_unlocked';
const ACHIEVEMENTS_KEY = 'quran_challenge_achievements'; 

function getUnlockedTrophyIds() {
  const idsString = localStorage.getItem(UNLOCKED_TROPHIES_KEY);
  if (!idsString) return [];
  try {
    return JSON.parse(idsString);
  } catch (error) {
    localStorage.removeItem(UNLOCKED_TROPHIES_KEY);
    return [];
  }
}

function getTrophyProgress() {
  const progressString = localStorage.getItem(TROPHY_PROGRESS_KEY);
  if (!progressString) return {};
  try {
    return JSON.parse(progressString);
  } catch (error) {
    localStorage.removeItem(TROPHY_PROGRESS_KEY);
    return {};
  }
}

function saveUnlockedTrophyIds(ids) {
  localStorage.setItem(UNLOCKED_TROPHIES_KEY, JSON.stringify(ids));
}

function saveTrophyProgress(progress) {
  localStorage.setItem(TROPHY_PROGRESS_KEY, JSON.stringify(progress));
}

function saveNewlyUnlockedIds(ids) {
  const newlyUnlockedIds = [...getNewlyUnlockedIds(), ...ids];
  localStorage.setItem(NEWLY_UNLOCKED_KEY, JSON.stringify({
    ids: newlyUnlockedIds,
    timestamp: Date.now()
  }));
}

function getNewlyUnlockedIds() {
  const newlyUnlockedString = localStorage.getItem(NEWLY_UNLOCKED_KEY);
  if (!newlyUnlockedString) return [];
  try {
    const data = JSON.parse(newlyUnlockedString);
    if (Date.now() - data.timestamp < 10000) {
      return data.ids;
    } else {
      clearNewlyUnlockedIds();
    }
    return [];
  } catch (error) {
    clearNewlyUnlockedIds();
    return [];
  }
}

export function clearNewlyUnlockedIds() {
  localStorage.removeItem(NEWLY_UNLOCKED_KEY);
}

export function getAchievements() {
  const unlockedIds = getUnlockedTrophyIds();
  const progress = getTrophyProgress();
  return trophyData.map(trophy => {
    const isUnlocked = unlockedIds.includes(trophy.id);
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
      unlockedAt: isUnlocked ? progress[`${trophy.id}_unlockedAt`] : undefined
    };
  });
}

function updateTrophyProgress(
  trophyId,
  currentValue,
  goalValue
) {
  const progress = getTrophyProgress();
  const unlockedIds = getUnlockedTrophyIds();
  const existingProgress = progress[trophyId];
  let existingValue = 0;
  if (typeof existingProgress === 'number') {
    existingValue = existingProgress;
  } else if (typeof existingProgress === 'string') {
    const parsed = parseInt(existingProgress, 10);
    if (!isNaN(parsed)) {
      existingValue = parsed;
    }
  }
  progress[trophyId] = Math.max(existingValue, currentValue);
  let isNewlyUnlocked = false;
  if (currentValue >= goalValue && !unlockedIds.includes(trophyId)) {
    unlockedIds.push(trophyId);
    progress[`${trophyId}_unlockedAt`] = new Date().toISOString();
    isNewlyUnlocked = true;
  }
  saveTrophyProgress(progress);
  saveUnlockedTrophyIds(unlockedIds);
  return isNewlyUnlocked;
}

export function updateAchievements(newGame) {
  const stats = getGameStats();
  const newlyUnlockedIds = [];
  trophyData.forEach(trophy => {
    let currentValue = 0;
    let shouldUpdate = false;
    switch (trophy.type) {
      case 'milestone':
        if (trophy.id === 'first_game') {
          currentValue = stats.totalGames > 0 ? 1 : 0;
          shouldUpdate = true;
        }
        break;
      case 'games_played':
        currentValue = stats.totalGames;
        shouldUpdate = true;
        break;
      case 'trophy_collection':
        currentValue = getUnlockedTrophyIds().length;
        shouldUpdate = true;
        break;
      case 'identify_streak':
        if (newGame.gameType === 'identify_surah') {
          currentValue = newGame.score;
          shouldUpdate = true;
        }
        break;
      case 'ordering_streak':
        if (newGame.gameType === 'surah_ordering') {
          currentValue = newGame.score;
          shouldUpdate = true;
        }
        break;
      case 'high_score':
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
  if (newlyUnlockedIds.length > 0) {
    saveNewlyUnlockedIds(newlyUnlockedIds);
  }
  return getAchievements().filter(a => newlyUnlockedIds.includes(a.id));
}

export function getNewlyUnlockedAchievements() {
  const newlyUnlockedIds = getNewlyUnlockedIds();
  if (newlyUnlockedIds.length === 0) return [];
  return getAchievements().filter(a => newlyUnlockedIds.includes(a.id));
}

export function saveAchievements(achievements) {
  const unlockedIds = achievements
    .filter(a => a.unlocked)
    .map(a => a.id);
  const progress = {};
  achievements.forEach(a => {
    if (a.progress !== undefined) {
      progress[a.id] = a.progress;
    }
    if (a.unlockedAt) {
      progress[`${a.id}_unlockedAt`] = a.unlockedAt;
    }
  });
  saveUnlockedTrophyIds(unlockedIds);
  saveTrophyProgress(progress);
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
}

export function checkAchievementsProgress() {
  const stats = getGameStats();
  const newlyUnlockedIds = [];
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
  if (newlyUnlockedIds.length > 0) {
    saveNewlyUnlockedIds(newlyUnlockedIds);
  }
  return getAchievements().filter(a => newlyUnlockedIds.includes(a.id));
}

export function incrementHighScoreBeatenCount() {
  const currentCount = parseInt(localStorage.getItem(HIGH_SCORE_BEATS_KEY) || '0');
  const newCount = currentCount + 1;
  localStorage.setItem(HIGH_SCORE_BEATS_KEY, newCount.toString());
  return newCount;
}
