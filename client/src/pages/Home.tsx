import { Link } from "wouter";
import { ArabesqueBorder } from "@/components/ui/arabesque-border";
import { StatsCard } from "@/components/ui/stats-card";
import { useRecentGames, useGameStats } from "@/hooks/useGameStats";
import { BookOpen, Search, ArrowUpDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const { data: recentGames, isLoading: isLoadingRecentGames } = useRecentGames(3);
  const { data: stats, isLoading: isLoadingStats } = useGameStats();
  
  const identifySurahStats = !isLoadingStats && stats ? {
    best: `${stats.bestStreak || 0}`,
    avgTime: "~40s",
    played: Math.floor(stats.totalGames / 2)
  } : { best: "0", avgTime: "0s", played: 0 };
  
  const surahOrderingStats = !isLoadingStats && stats ? {
    best: `${stats.bestStreak || 0}`,
    avgTime: "~35s",
    played: Math.ceil(stats.totalGames / 2)
  } : { best: "0", avgTime: "0s", played: 0 };

  return (
    <div className="pb-4">
      <div className="relative overflow-hidden mb-8 rounded-lg bg-primary/5">
        <div className="absolute inset-0 opacity-10 islamic-pattern"></div>
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

      {/* Stats Overview */}
      {!isLoadingStats && stats && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
            <span className="mr-2 text-secondary text-2xl">•</span> Your Statistics
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatsCard title="Total Games" value={stats.totalGames} />
            <StatsCard title="Best Streak" value={stats.bestStreak} />
          </div>
        </div>
      )}

      {/* Game Instructions */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
          <span className="mr-2 text-secondary text-2xl">•</span> How to Play
        </h3>
        
        <div className="p-3 bg-gray-50 rounded-lg mb-3">
          <p className="text-gray-700 mb-2">Select a game mode from the bottom navigation:</p>
          <div className="flex items-center mb-2">
            <div className="bg-primary/10 p-2 rounded-md mr-3">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Identify</p>
              <p className="text-sm text-gray-600">Identify which Surah contains a given Ayah</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-md mr-3">
              <ArrowUpDown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Ordering</p>
              <p className="text-sm text-gray-600">Arrange Surahs in their correct sequential order</p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 px-2">Both games are in endless mode - continue playing until you make a mistake. Try to achieve the highest possible streak!</p>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
          <span className="mr-2 text-secondary text-2xl">•</span> Recent Activity
        </h3>
        
        {isLoadingRecentGames ? (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            Loading recent games...
          </div>
        ) : recentGames && Array.isArray(recentGames) && recentGames.length > 0 ? (
          <div className="space-y-3">
            {recentGames.map((game) => {
              const gameType = game.gameType === "identify_surah" ? "Identify Surah" : "Surah Ordering";
              const scoreText = `${game.score}/${game.maxScore}`;
              const timeText = `${Math.floor(game.timeSpent / 60)}:${(game.timeSpent % 60).toString().padStart(2, '0')}`;
              const timeAgo = formatDistanceToNow(new Date(game.completedAt), { addSuffix: true });
              
              return (
                <div key={game.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
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
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-500">No recent games found</p>
          </div>
        )}
      </div>
    </div>
  );
}
