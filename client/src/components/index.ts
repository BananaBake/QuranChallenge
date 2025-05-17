// Layout Components
export { default as BottomNavigation } from './layout/BottomNavigation';

// Common Components
export { PageContainer } from './common/PageContainer';

// Achievement components
export * from './achievements';

// Game specific components
export { GameResult } from './game/GameResult';
export { GameControls } from './game/GameControls';
export { GameHeader, GameStatsBar } from './game/GameHeader';

// Re-export UI components for convenience
export { 
  // Core UI
  Button,
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Input,
  AlertMessage, AlertMessagesContainer, useAlertMessage,
  Progress,
  Badge,
  LoadingSpinner,
  ArabesqueBorder,
  
  // Game UI
  StatsCard,
  GameCard,
  QuranText,
  SurahOption,
  DraggableSurah,
  RecentGamesTable
} from './ui';