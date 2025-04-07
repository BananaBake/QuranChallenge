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
    best: `${stats.modePerformance.identifySurah}%`,
    avgTime: "45s",
    played: Math.floor(stats.totalGames / 2)
  } : { best: "0%", avgTime: "0s", played: 0 };
  
  const surahOrderingStats = !isLoadingStats && stats ? {
    best: `${stats.modePerformance.surahOrdering}%`,
    avgTime: "38s",
    played: Math.ceil(stats.totalGames / 2)
  } : { best: "0%", avgTime: "0s", played: 0 };

  return (
    <div>
      <ArabesqueBorder className="mb-6">
        <div className="p-4">
          <h2 className="text-xl font-bold text-primary mb-3 text-center">Welcome to Quran Learning</h2>
          <p className="mb-4 text-center">Enhance your Quranic knowledge through interactive challenges</p>
          
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full border-2 border-secondary flex items-center justify-center bg-primary/10">
              <span className="font-arabic text-secondary text-3xl">قرآن</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Link href="/identify-surah">
              <Button className="bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg shadow transition duration-300 ease-in-out flex flex-col items-center h-auto">
                <Play className="w-5 h-5 mb-1" />
                <span>Start Game</span>
              </Button>
            </Link>
            <Link href="/statistics">
              <Button className="bg-accent hover:bg-accent/90 text-white py-3 px-4 rounded-lg shadow transition duration-300 ease-in-out flex flex-col items-center h-auto">
                <BarChart className="w-5 h-5 mb-1" />
                <span>Statistics</span>
              </Button>
            </Link>
          </div>
        </div>
      </ArabesqueBorder>

      {/* Game Modes */}
      <h3 className="text-lg font-bold text-primary mb-3 flex items-center">
        <span className="mr-2 text-secondary">🎮</span> Game Modes
      </h3>
      
      <GameCard 
        title="Identify the Surah"
        description="Identify which Surah contains a given Ayah"
        path="/identify-surah"
        stats={identifySurahStats}
      />
      
      <GameCard 
        title="Surah Ordering"
        description="Arrange Surahs in their correct sequential order"
        path="/surah-ordering"
        stats={surahOrderingStats}
      />
      
      {/* Recent Activity */}
      <h3 className="text-lg font-bold text-primary mb-3 flex items-center mt-6">
        <span className="mr-2 text-secondary">🕰️</span> Recent Activity
      </h3>
      
      {isLoadingRecentGames ? (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 text-center">
          Loading recent games...
        </div>
      ) : (
        <RecentGamesTable games={recentGames || []} />
      )}
    </div>
  );
}
