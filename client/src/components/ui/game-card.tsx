import { Link } from "wouter";
import { Play } from "lucide-react";
import { Trophy, Clock, Star } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  path: string;
  stats: {
    best: string;
    avgTime: string;
    played: number;
  };
}

export function GameCard({ title, description, path, stats }: GameCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-bold text-lg text-primary">{title}</h4>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <Link href={path}>
            <div className="bg-secondary hover:bg-secondary/90 text-white h-12 w-12 rounded-full flex items-center justify-center shadow-md transition-colors duration-300 ml-4">
              <Play className="w-6 h-6" />
            </div>
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col items-center bg-gray-50 rounded-md p-2">
            <Trophy className="w-4 h-4 text-secondary mb-1" /> 
            <span className="font-bold">{stats.best}</span>
            <span className="text-gray-500 text-xs">High Score</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 rounded-md p-2">
            <Clock className="w-4 h-4 text-primary mb-1" /> 
            <span className="font-bold">{stats.avgTime}</span>
            <span className="text-gray-500 text-xs">Avg Time</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 rounded-md p-2">
            <Star className="w-4 h-4 text-secondary mb-1" /> 
            <span className="font-bold">{stats.played}</span>
            <span className="text-gray-500 text-xs">Played</span>
          </div>
        </div>
      </div>
    </div>
  );
}
