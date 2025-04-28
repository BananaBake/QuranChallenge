import { memo, useMemo } from "react";
import { StatsCard, PageContainer } from "@/components";
import { useRecentGames, useGameStats } from "@/hooks/useGameStats";
import { BookOpen, Search, ArrowUpDown, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { GameHistory } from "@shared/schema";

interface HeroSectionProps {
  className?: string;
}

const HeroSection = memo(({ className }: HeroSectionProps) => (
  <div className={cn("relative overflow-hidden mb-8 rounded-lg bg-primary/5", className)}>
    <div className="absolute inset-0 opacity-10 islamic-pattern" aria-hidden="true"></div>
    <div className="relative p-6 z-10">
      <h2 className="text-2xl font-bold text-primary mb-3 text-center">Quran Challenge</h2>
      <p className="mb-6 text-center text-gray-700">Test your Quranic knowledge through endless challenges</p>
      
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full border-2 border-secondary flex items-center justify-center bg-white shadow-md">
          <span className="font-arabic text-secondary text-3xl">قرآن</span>
        </div>
      </div>
    </div>
  </div>
));

HeroSection.displayName = "HeroSection";

interface StatsOverviewProps {
  totalGames: number;
  bestStreak: number;
  className?: string;
}

const StatsOverview = memo(({ totalGames, bestStreak, className }: StatsOverviewProps) => (
  <div className={cn("bg-white rounded-lg shadow-md p-4 mb-6", className)}>
    <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
      <span className="mr-2 text-secondary text-2xl">•</span> Your Statistics
    </h3>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
      <StatsCard title="Total Games" value={totalGames} />
      <StatsCard title="Best Streak" value={bestStreak} />
    </div>
  </div>
));

StatsOverview.displayName = "StatsOverview";

interface GameModeProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const GameMode = memo(({ icon: Icon, title, description }: GameModeProps) => (
  <div className="flex items-center mb-2">
    <div className="bg-primary/10 p-2 rounded-md mr-3">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
));

GameMode.displayName = "GameMode";

interface GameInstructionsProps {
  className?: string;
}

const GameInstructions = memo(({ className }: GameInstructionsProps) => (
  <div className={cn("bg-white rounded-lg shadow-md p-4 mb-6", className)}>
    <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
      <span className="mr-2 text-secondary text-2xl">•</span> How to Play
    </h3>
    
    <div className="p-3 bg-gray-50 rounded-lg mb-3">
      <p className="text-gray-700 mb-2">Select a game mode from the bottom navigation:</p>
      <GameMode 
        icon={Search} 
        title="Identify" 
        description="Identify which Surah contains a given Ayah" 
      />
      <GameMode 
        icon={ArrowUpDown} 
        title="Ordering" 
        description="Arrange Surahs in their correct sequential order" 
      />
    </div>
    
    <p className="text-sm text-gray-600 px-2">Both games are in endless mode - continue playing until you make a mistake. Try to achieve the highest possible streak!</p>
  </div>
));

GameInstructions.displayName = "GameInstructions";

interface GameHistoryItemProps {
  game: GameHistory;
  isNewHighScore: boolean;
}

const GameHistoryItem = memo(({ game, isNewHighScore }: GameHistoryItemProps) => {
  const gameType = game.gameType === "identify_surah" ? "Identify Surah" : "Surah Ordering";
  // Ensure score is displayed correctly
  const scoreText = `${game.score || game.maxScore || 0}`;
  const timeText = `${Math.floor(game.timeSpent / 60)}:${(game.timeSpent % 60).toString().padStart(2, '0')}`;
  const timeAgo = formatDistanceToNow(new Date(game.completedAt), { addSuffix: true });
  
  return (
    <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
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
      {isNewHighScore && (
        <div className="text-center ml-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
      )}
    </div>
  );
});

GameHistoryItem.displayName = "GameHistoryItem";

interface RecentActivityProps {
  games: GameHistory[] | undefined;
  isLoading: boolean;
  stats: any;
  className?: string;
}

const RecentActivity = memo(({ games, isLoading, stats, className }: RecentActivityProps) => (
  <div className={cn("bg-white rounded-lg shadow-md p-4 mb-6", className)}>
    <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
      <span className="mr-2 text-secondary text-2xl">•</span> Recent Activity
    </h3>
    
    {isLoading ? (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-500">Loading recent games...</p>
      </div>
    ) : games && Array.isArray(games) && games.length > 0 ? (
      <div className="space-y-3">
        {games.map((game) => {
          const isNewHighScore = game.score > (stats?.modePerformance?.[game.gameType === "identify_surah" ? "identifySurah" : "surahOrdering"] || 0) - 1;
          return (
            <GameHistoryItem 
              key={game.id} 
              game={game} 
              isNewHighScore={isNewHighScore} 
            />
          );
        })}
      </div>
    ) : (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-500">No recent games found</p>
      </div>
    )}
  </div>
));

RecentActivity.displayName = "RecentActivity";

export default function Home() {
  const { data: recentGames, isLoading: isLoadingRecentGames } = useRecentGames(10);
  const { data: stats, isLoading: isLoadingStats } = useGameStats();
  
  const { totalGames, bestStreak } = useMemo(() => {
    if (!isLoadingStats && stats) {
      return {
        totalGames: stats.totalGames,
        bestStreak: stats.bestStreak
      };
    }
    return { totalGames: 0, bestStreak: 0 };
  }, [isLoadingStats, stats]);
  
  return (
    <PageContainer className="pb-4">
      <HeroSection />
      
      {!isLoadingStats && stats && (
        <StatsOverview totalGames={totalGames} bestStreak={bestStreak} />
      )}
      
      <GameInstructions />
      
      <RecentActivity 
        games={recentGames} 
        isLoading={isLoadingRecentGames} 
        stats={stats} 
      />
    </PageContainer>
  );
}
