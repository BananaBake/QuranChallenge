export { default as BottomNavigation } from './layout/BottomNavigation.jsx';
export { PageContainer } from './common/index.js'; // PageContainer is exported from common/index.js
export * from './achievements/index.js'; // Re-exports all from achievements/index.js
export { GameResult, GameControls, GameHeader, GameStatsBar } from './game/index.js'; // Specific exports from game/index.js

// All these UI components are exported from ui/index.js
export {
  Button,
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  AlertMessage, AlertMessagesContainer, useAlertMessage,
  Progress,
  LoadingSpinner,
  ArabesqueBorder,
  StatsCard,
  GameCard,
  QuranText,
  SurahOption,
  DraggableSurah,
  RecentGamesTable,
  Dialog, // Added Dialog and its parts as they are in ui/index.js
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  Tabs, // Added Tabs and its parts as they are in ui/index.js
  TabsContent,
  TabsList,
  TabsTrigger
} from './ui/index.js';
