// Layout Components
export { default as Header } from './layout/Header';
export { default as BottomNavigation } from './layout/BottomNavigation';

// Common UI Components
export { ArabesqueBorder } from './ui/arabesque-border';
export { StatsCard } from './ui/stats-card';
export { LoadingSpinner } from './ui/loading-spinner';
export { PageContainer } from './common/PageContainer';

// Re-export game components
export * from './game';

// Re-export achievement components
export * from './achievements';

// UI Kit Components
export { 
  Button,
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Input,
  Toaster,
  Progress,
  Badge
} from './ui';