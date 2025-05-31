import { formatDistanceToNow } from "date-fns";
import { Trophy, Clock } from "lucide-react";

export function RecentGamesTable({ games }) {
  if (!games || games.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No recent games found.</p>
        <p className="text-sm mt-1">Start playing to see your game history!</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {games.map((game) => (
        <div key={game.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div>
              <p className="font-medium text-sm capitalize">
                {game.gameType?.replace('_', ' ') || 'Game'}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(game.completedAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-primary">{game.score}</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {game.timeSpent}s
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
