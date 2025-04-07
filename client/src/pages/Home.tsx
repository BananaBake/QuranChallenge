import { Link } from "wouter";
import { GameCard } from "@/components/ui/game-card";
import { ArabesqueBorder } from "@/components/ui/arabesque-border";
import { RecentGamesTable } from "@/components/ui/recent-games-table";
import { useRecentGames, useGameStats } from "@/hooks/useGameStats";
import { Play, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: recentGames, isLoading: isLoadingRecentGames } = useRecentGames(3);
  const { data: stats, isLoading: isLoadingStats } = useGameStats();
  
  const identifySurahStats = !isLoadingStats && stats ? {
    best: `${stats.modePerformance.identifySurah || 0}`,
    avgTime: "~40s",
    played: Math.floor(stats.totalGames / 2)
  } : { best: "0", avgTime: "0s", played: 0 };
  
  const surahOrderingStats = !isLoadingStats && stats ? {
    best: `${stats.modePerformance.surahOrdering || 0}`,
    avgTime: "~35s",
    played: Math.ceil(stats.totalGames / 2)
  } : { best: "0", avgTime: "0s", played: 0 };

  return (
    <div className="pb-4">
      <div className="relative overflow-hidden mb-8 rounded-lg bg-primary/5">
        <div className="absolute inset-0 opacity-10 islamic-pattern"></div>
        <div className="relative p-6 z-10">
          <h2 className="text-2xl font-bold text-primary mb-3 text-center">Welcome to Quran Learning</h2>
          <p className="mb-6 text-center text-gray-700">Enhance your Quranic knowledge through interactive challenges</p>
          
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 rounded-full border-2 border-secondary flex items-center justify-center bg-white shadow-md">
              <span className="font-arabic text-secondary text-4xl">قرآن</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Link href="/identify-surah">
              <Button className="bg-primary hover:bg-primary/90 text-white py-4 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex flex-col items-center h-auto w-full">
                <Play className="w-6 h-6 mb-2" />
                <span className="font-medium">Start Game</span>
              </Button>
            </Link>
            <Link href="/statistics">
              <Button className="bg-accent hover:bg-accent/90 text-white py-4 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex flex-col items-center h-auto w-full">
                <BarChart className="w-6 h-6 mb-2" />
                <span className="font-medium">Statistics</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Game Modes */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
          <span className="mr-2 text-secondary text-2xl">•</span> Game Modes
        </h3>
        
        <div className="space-y-4">
          <GameCard 
            title="Identify the Surah"
            description="Identify which Surah contains a given Ayah - Endless Mode"
            path="/identify-surah"
            stats={identifySurahStats}
          />
          
          <GameCard 
            title="Surah Ordering"
            description="Arrange Surahs in their correct sequential order - Endless Mode"
            path="/surah-ordering"
            stats={surahOrderingStats}
          />
        </div>
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
          <RecentGamesTable games={recentGames} />
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            No recent games found.
          </div>
        )}
      </div>
    </div>
  );
}
