import { Button } from "@/components/ui/button";
import { Trophy, Clock } from "lucide-react";

interface GameResultProps {
  score: number;
  formattedTime: string;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
  gameModeName?: string;
}

export function GameResult({ 
  score, 
  formattedTime, 
  isNewHighScore, 
  onPlayAgain,
  gameModeName = "Surah"
}: GameResultProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h2 className="text-2xl font-bold text-primary mb-2">
        {isNewHighScore ? '🏆 New High Score!' : 'Great Effort!'}
      </h2>
      
      {isNewHighScore ? (
        <p className="text-accent font-bold mb-4">
          Congratulations! You've beaten your previous best score!
        </p>
      ) : (
        <p className="text-primary font-medium mb-4">
          You did well! Each attempt helps you learn more about the Quran.
        </p>
      )}
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Trophy className="w-5 h-5 text-secondary mr-2" />
            <span className="text-gray-600">Score:</span>
          </div>
          <span className="font-bold text-xl text-primary">{score}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-primary mr-2" />
            <span className="text-gray-600">Time:</span>
          </div>
          <span className="font-bold text-xl text-accent">{formattedTime}</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        You correctly identified {score} {score === 1 ? gameModeName : `${gameModeName}s`}.
        {isNewHighScore && ' Keep going to improve your knowledge!'}
      </p>
      
      <Button 
        className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base shadow-md"
        onClick={onPlayAgain}
      >
        Play Again
      </Button>
    </div>
  );
}