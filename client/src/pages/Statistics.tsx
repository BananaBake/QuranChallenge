import { useGameStats, useRecentGames } from "@/hooks/useGameStats";
import { StatsCard } from "@/components/ui/stats-card";
import { ArabesqueBorder } from "@/components/ui/arabesque-border";
import { formatDistanceToNow, parseISO } from "date-fns";

export default function Statistics() {
  const { data: stats, isLoading: isLoadingStats } = useGameStats();
  const { data: recentGames, isLoading: isLoadingRecentGames } = useRecentGames(5);
  
  if (isLoadingStats || isLoadingRecentGames) {
    return <div className="text-center p-8">Loading statistics...</div>;
  }
  
  if (!stats) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-primary mb-4">No Statistics Yet</h2>
        <p>Play some games to start tracking your progress!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">Your Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatsCard title="Total Games" value={stats.totalGames} />
        <StatsCard title="Avg. Score" value={`${stats.averageScore.toFixed(1)}%`} />
        <StatsCard title="Best Streak" value={stats.bestStreak} />
        <StatsCard title="Ayat Learned" value={stats.ayatLearned} />
        <StatsCard title="Records Broken" value={stats.highScoreBeatenCount} />
      </div>
      
      {/* Performance by Game Mode */}
      <h3 className="text-lg font-bold text-primary mb-3">Performance by Game Mode</h3>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Identify the Surah</span>
            <span className="text-sm font-medium text-primary">{stats.modePerformance.identifySurah}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${stats.modePerformance.identifySurah}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Surah Ordering</span>
            <span className="text-sm font-medium text-primary">{stats.modePerformance.surahOrdering}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${stats.modePerformance.surahOrdering}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Recent History */}
      <h3 className="text-lg font-bold text-primary mb-3">Recent History</h3>
      
      {recentGames && recentGames.length > 0 ? (
        <div className="space-y-3 mb-6">
          {recentGames.map((game) => {
            const gameType = game.gameType === "identify_surah" ? "Identify Surah" : "Surah Ordering";
            const scoreText = `${game.score}/${game.maxScore}`;
            const timeText = `${Math.floor(game.timeSpent / 60)}:${(game.timeSpent % 60).toString().padStart(2, '0')}`;
            const timeAgo = formatDistanceToNow(new Date(game.completedAt), { addSuffix: true });
            
            return (
              <div key={game.id} className="bg-white rounded-lg shadow p-3 flex justify-between items-center">
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
        <ArabesqueBorder className="mb-6">
          <div className="p-4 text-center">
            <p className="text-gray-500">No recent games found</p>
          </div>
        </ArabesqueBorder>
      )}
    </div>
  );
}
