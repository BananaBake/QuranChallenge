// Export all hooks for easier imports
export * from './use-mobile';
export * from './useGameStats';
export * from './useQuranData';
export * from './useGameTimer';
export * from './useAchievements';
export * from './useGameState';
export * from './useGameData';

// Note: We're keeping useLocalStorage for backward compatibility,
// but new code should use the specific hooks above
export * from './useLocalStorage';