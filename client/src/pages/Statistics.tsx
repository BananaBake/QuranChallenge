import { memo, useMemo } from "react";
import { useGameStats, useRecentGames } from "@/hooks/useGameStats";
import { StatsCard } from "@/components/ui/stats-card";
import { ArabesqueBorder } from "@/components/ui/arabesque-border";
import { PageContainer } from "@/components/common/PageContainer";
import { formatDistanceToNow } from "date-fns";
import { GameHistory, GameStats } from "@shared/schema";
import { cn } from "@/lib/utils";

interface LoadingViewProps {
  message?: string;
}

const LoadingView = memo(({ message = "Loading statistics..." }: LoadingViewProps) => (
  <div className="text-center p-8">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
    <p className="text-gray-600">{message}</p>
  </div>
));

LoadingView.displayName = "LoadingView";

interface EmptyStatsViewProps {
  message?: string;
}

const EmptyStatsView = memo(({ message = "Play some games to start tracking your progress!" }: EmptyStatsViewProps) => (
  <div className="text-center p-8">
    <h2 className="text-xl font-bold text-primary mb-4">No Statistics Yet</h2>
    <p>{message}</p>
  </div>
));

EmptyStatsView.displayName = "EmptyStatsView";

interface OverviewCardsProps {
  stats: GameStats;
}

const OverviewCards = memo(({ stats }: OverviewCardsProps) => (
  <div className="grid grid-cols-2 gap-4 mb-6">
    <StatsCard title="Total Games" value={stats.totalGames} />
    <StatsCard title="Avg. Score" value={`${stats.averageScore.toFixed(1)}%`} />
    <StatsCard title="Best Streak" value={stats.bestStreak} />
    <StatsCard title="Ayat Learned" value={stats.ayatLearned} />
    <StatsCard title="Records Broken" value={stats.highScoreBeatenCount} />
  </div>
));

OverviewCards.displayName = "OverviewCards";

interface PerformanceBarProps {
  label: string;
  value: number;
  className?: string;
}

const PerformanceBar = memo(({ label, value, className }: PerformanceBarProps) => (
  <div className={cn("mb-4", className)}>
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm font-medium text-primary">{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out" 
        style={{ width: `${Math.max(value, 3)}%` }}
      ></div>
    </div>
  </div>
));

PerformanceBar.displayName = "PerformanceBar";

interface GameModePerformanceProps {
  stats: GameStats;
}

const GameModePerformance = memo(({ stats }: GameModePerformanceProps) => (
  <>
    <h3 className="text-lg font-bold text-primary mb-3">Performance by Game Mode</h3>
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <PerformanceBar 
        label="Identify the Surah" 
        value={stats.modePerformance.identifySurah} 
      />
      <PerformanceBar 
        label="Surah Ordering" 
        value={stats.modePerformance.surahOrdering} 
        className="mb-0"
      />
    </div>
  </>
));

GameModePerformance.displayName = "GameModePerformance";

interface GameHistoryItemProps {
  game: GameHistory;
}

const GameHistoryItem = memo(({ game }: GameHistoryItemProps) => {
  const gameType = game.gameType === "identify_surah" ? "Identify Surah" : "Surah Ordering";
  const scoreText = `${game.score}/${game.maxScore}`;
  const timeText = `${Math.floor(game.timeSpent / 60)}:${(game.timeSpent % 60).toString().padStart(2, '0')}`;
  const timeAgo = formatDistanceToNow(new Date(game.completedAt), { addSuffix: true });
  
  return (
    <div className="bg-white rounded-lg shadow p-3 flex justify-between items-center">
      <div>
        <h4 className="font-bold">{gameType}</h4>
        <p className="text-xs text-gray-500">{timeAgo}</p>
      </div>
      <div className="text-center">
        <span className="text-lg font-bold text-primary">{scoreText}</span>
        <p className="text-xs text-gray-500">Score</p>
      </div>
      <div className="text-center">
        <span className="text-lg font-bold text-accent">{timeText}</span>
        <p className="text-xs text-gray-500">Time</p>
      </div>
    </div>
  );
});

GameHistoryItem.displayName = "GameHistoryItem";

interface RecentHistoryProps {
  games?: GameHistory[];
}

const RecentHistory = memo(({ games }: RecentHistoryProps) => (
  <>
    <h3 className="text-lg font-bold text-primary mb-3">Recent History</h3>
    
    {games && games.length > 0 ? (
      <div className="space-y-3 mb-6">
        {games.map((game) => (
          <GameHistoryItem key={game.id} game={game} />
        ))}
      </div>
    ) : (
      <ArabesqueBorder className="mb-6">
        <div className="p-4 text-center">
          <p className="text-gray-500">No recent games found</p>
        </div>
      </ArabesqueBorder>
    )}
  </>
));

RecentHistory.displayName = "RecentHistory";

export default function Statistics() {
  const { data: stats, isLoading: isLoadingStats } = useGameStats();
  const { data: recentGames, isLoading: isLoadingRecentGames } = useRecentGames(5);
  
  const isLoading = useMemo(() => 
    isLoadingStats || isLoadingRecentGames,
  [isLoadingStats, isLoadingRecentGames]);
  
  if (isLoading) {
    return <PageContainer><LoadingView /></PageContainer>;
  }
  
  if (!stats) {
    return <PageContainer><EmptyStatsView /></PageContainer>;
  }

  return (
    <PageContainer>
      <h2 className="text-xl font-bold text-primary mb-4">Your Statistics</h2>
      
      <OverviewCards stats={stats} />
      <GameModePerformance stats={stats} />
      <RecentHistory games={recentGames} />
    </PageContainer>
  );
}
