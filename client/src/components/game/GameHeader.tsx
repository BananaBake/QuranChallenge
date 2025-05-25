import { Trophy, Clock } from "lucide-react";
interface GameHeaderProps {
  title: string;
  subtitle?: string;
  score: number;
}
export function GameHeader({ title, subtitle, score }: GameHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
      <div className="mr-2">
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      <div className="bg-primary text-white rounded-full h-10 px-4 flex items-center justify-center font-bold whitespace-nowrap">
        Score: {score}
      </div>
    </div>
  );
}
interface GameStatsBarProps {
  previousHighScore: number;
  currentScore: number;
  formattedTime: string;
}
export function GameStatsBar({ previousHighScore, currentScore, formattedTime }: GameStatsBarProps) {
  return (
    <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
      <div className="flex items-center">
        <Trophy className="w-4 h-4 text-secondary mr-1" />
        <span className="text-sm">Best: {Math.max(previousHighScore, currentScore)}</span>
      </div>
      <div className="flex items-center">
        <Clock className="w-4 h-4 text-primary mr-1" />
        <span className="text-sm">Time: {formattedTime}</span>
      </div>
    </div>
  );
}