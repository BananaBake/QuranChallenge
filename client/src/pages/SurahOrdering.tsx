import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { DraggableSurah } from "@/components/ui/draggable-surah";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Check, Trophy, Clock, Loader2 } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { useSurahOrderingData } from "@/hooks/useGameData";
import { useAchievementNotifications } from "@/hooks/useAchievements";

interface GameResultProps {
  score: number;
  formattedTime: string;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
}

const GameResult = ({ score, formattedTime, isNewHighScore, onPlayAgain }: GameResultProps) => (
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
        You did well! Each attempt helps you learn more about the order of the Quran.
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
      You correctly ordered {score} {score === 1 ? 'round' : 'rounds'} of Surahs.
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

interface GameControlsProps {
  checked: boolean;
  isCorrect: boolean;
  gameEnded: boolean;
  isLoadingNext: boolean;
  onCheckOrder: () => void;
  onSeeResults: () => void;
  onNext: () => void;
}

const GameControls = ({ 
  checked, 
  isCorrect, 
  gameEnded,
  isLoadingNext, 
  onCheckOrder, 
  onSeeResults,
  onNext
}: GameControlsProps) => (
  <div className="flex justify-center mt-6">
    {!checked ? (
      <Button 
        className="bg-primary hover:bg-primary/90 text-white px-6 py-4 text-base shadow-md"
        onClick={onCheckOrder}
        disabled={isLoadingNext}
      >
        <Check className="w-5 h-5 mr-2" /> Check Order
      </Button>
    ) : checked && !isCorrect ? (
      <Button
        className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-base shadow-md"
        onClick={onSeeResults}
        disabled={isLoadingNext}
      >
        See Results
      </Button>
    ) : (
      isCorrect && !gameEnded && (
        <Button
          className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base shadow-md"
          onClick={onNext}
          disabled={isLoadingNext}
        >
          {isLoadingNext ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading...
            </>
          ) : (
            'Next Question'
          )}
        </Button>
      )
    )}
  </div>
);

export default function SurahOrdering() {
  const {
    score,
    gameEnded,
    previousHighScore,
    isNewHighScore,
    formattedTime,
    incrementScore,
    endGame,
    checkHighScore,
    resetGame
  } = useGameState({ gameMode: 'surah_ordering' });
  
  const {
    surahs,
    isLoading,
    isLoadingNext,
    initializeSurahs,
    loadNextQuestion,
    handleMoveSurah,
    checkCorrectOrder,
    originalSurahs
  } = useSurahOrderingData();
  
  const { checkProgress } = useAchievementNotifications();
  
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  useEffect(() => {
    if (originalSurahs && originalSurahs.length > 0 && !gameEnded) {
      initializeSurahs(originalSurahs);
    }
  }, [originalSurahs, gameEnded, initializeSurahs]);
  
  const handleCheckOrder = useCallback(() => {
    setChecked(true);
    
    const orderCorrect = checkCorrectOrder();
    setIsCorrect(orderCorrect);
    
    if (orderCorrect) {
      incrementScore();
    } else {
      checkHighScore();
    }
  }, [checkCorrectOrder, incrementScore, checkHighScore]);
  
  const handleNext = useCallback(() => {
    if (gameEnded) return;
    
    setChecked(false);
    
    if (isCorrect) {
      loadNextQuestion();
      checkProgress();
    }
  }, [gameEnded, isCorrect, loadNextQuestion, checkProgress]);
  
  const handleStartNewGame = useCallback(() => {
    resetGame();
    setChecked(false);
    setIsCorrect(false);
    loadNextQuestion();
  }, [resetGame, loadNextQuestion]);
  
  if (isLoading) {
    return <LoadingSpinner message="Loading surahs..." />;
  }
  
  if (gameEnded) {
    return (
      <GameResult 
        score={score}
        formattedTime={formattedTime}
        isNewHighScore={isNewHighScore}
        onPlayAgain={handleStartNewGame}
      />
    );
  }
  
  const getFeedbackMessage = () => {
    if (checked) {
      return isCorrect 
        ? "✓ Correct! Your order is perfect."
        : "✗ Incorrect. The correct order is from lowest to highest surah number.";
    }
    return "Drag and drop the Surahs to arrange them in the correct Qur'anic order (from lowest to highest number)";
  };
  
  const getFeedbackClass = () => {
    if (!checked) return "bg-primary/10 text-primary";
    return isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };
  
  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-5 mb-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-2xl font-bold text-primary">Surah Ordering</h2>
            <p className="text-sm text-gray-600 mt-1">Arrange the Surahs in correct order</p>
          </div>
          <div className="bg-primary text-white rounded-full h-10 px-4 flex items-center justify-center font-bold">
            Score: {score}
          </div>
        </div>
        
        <div className={`p-3 text-center mb-6 rounded-lg ${getFeedbackClass()}`}>
          <p className="font-medium">{getFeedbackMessage()}</p>
        </div>
        
        <div className="space-y-2 mb-6">
          {surahs.map((surah, index) => (
            <DraggableSurah
              key={surah.number}
              name={surah.englishName}
              arabicName={surah.name}
              number={surah.number}
              index={index}
              onMoveItem={handleMoveSurah}
              showNumber={checked}
            />
          ))}
        </div>
        
        {isLoadingNext && (
          <div className="flex items-center justify-center p-4 mt-4 bg-primary/10 text-primary rounded-lg">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Loading next challenge...</span>
          </div>
        )}
        
        <GameControls 
          checked={checked}
          isCorrect={isCorrect}
          gameEnded={gameEnded}
          isLoadingNext={isLoadingNext}
          onCheckOrder={handleCheckOrder}
          onSeeResults={endGame}
          onNext={handleNext}
        />
      </div>
      
      <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Trophy className="w-4 h-4 text-secondary mr-1" />
          <span className="text-sm">Best: {Math.max(previousHighScore, score)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-primary mr-1" />
          <span className="text-sm">Time: {formattedTime}</span>
        </div>
      </div>
    </div>
  );
}