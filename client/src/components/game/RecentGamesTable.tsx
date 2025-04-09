import { GameHistory } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface RecentGamesTableProps {
  games: GameHistory[];
}

export function RecentGamesTable({ games }: RecentGamesTableProps) {
  if (!games || games.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 text-center text-gray-500">
        No recent games found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-left text-sm">Game</th>
              <th className="py-2 text-left text-sm">Score</th>
              <th className="py-2 text-left text-sm">Date</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id} className="border-b border-gray-100">
                <td className="py-2 text-sm">
                  {game.gameType === "identify_surah" ? "Identify Surah" : "Surah Ordering"}
                </td>
                <td className="py-2 text-sm">
                  <span className="text-primary font-medium">
                    {game.score}/{game.maxScore}
                  </span>
                </td>
                <td className="py-2 text-sm text-gray-500">
                  {formatDistanceToNow(new Date(game.completedAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}