import { Link } from "wouter";
import { Play } from "lucide-react";
import { ArabesqueBorder } from "./arabesque-border";
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
    <ArabesqueBorder className="mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <Link href={path}>
            <a className="bg-secondary hover:bg-secondary/90 text-white h-10 w-10 rounded-full flex items-center justify-center shadow">
              <Play className="w-5 h-5" />
            </a>
          </Link>
        </div>
        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
          <span>
            <Trophy className="inline-block mr-1 w-3 h-3 text-secondary" /> Best: {stats.best}
          </span>
          <span>
            <Clock className="inline-block mr-1 w-3 h-3 text-primary" /> Avg: {stats.avgTime}
          </span>
          <span>
            <Star className="inline-block mr-1 w-3 h-3 text-secondary" /> Played: {stats.played}
          </span>
        </div>
      </div>
    </ArabesqueBorder>
  );
}
