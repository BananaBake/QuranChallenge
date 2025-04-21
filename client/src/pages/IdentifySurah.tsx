import { useState, useEffect } from "react";
import { useSurahs } from "@/hooks/useQuranData";
import { Button } from "@/components/ui/button";
import { QuranText } from "@/components/ui/quran-text";
import { SurahOption } from "@/components/ui/surah-option";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Check, Trophy, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGameState } from "@/hooks/useGameState";
import { useIdentifySurahData } from "@/hooks/useGameData";
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
      You correctly identified {score} {score === 1 ? 'Surah' : 'Surahs'}.
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
  revealAnswer: boolean;
  selectedOption: number | null;
  isLoadingNext: boolean;
  isCorrectAnswer: boolean;
  onConfirm: () => void;
  onNext: () => void;
  onEndGame: () => void;
}

const GameControls = ({ 
  revealAnswer, 
  selectedOption, 
  isLoadingNext, 
  isCorrectAnswer,
  onConfirm, 
  onNext, 
  onEndGame 
}: GameControlsProps) => (
  <div className="flex justify-center mt-6">
    {!revealAnswer ? (
      <Button 
        className="bg-primary hover:bg-primary/90 text-white px-6 py-4 text-base shadow-md"
        onClick={onConfirm}
        disabled={selectedOption === null || isLoadingNext}
      >
        <Check className="w-5 h-5 mr-2" /> Confirm
      </Button>
    ) : !isCorrectAnswer ? (
      <Button
        className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-base shadow-md"
        onClick={onEndGame}
        disabled={isLoadingNext}
      >
        See Results
      </Button>
    ) : (
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
    )}
  </div>
);

export default function IdentifySurah() {
  const { data: allSurahs, isLoading: isLoadingSurahs } = useSurahs();
  const { toast } = useToast();
  
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
  } = useGameState({ gameMode: 'identify_surah' });
  
  const {
    isLoading,
    currentAyah,
    options,
    isLoadingNext,
    loadNextQuestion,
    initializeQuestion
  } = useIdentifySurahData();
  
  const { checkProgress } = useAchievementNotifications();
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealAnswer, setRevealAnswer] = useState(false);
  
  useEffect(() => {
    if (allSurahs && allSurahs.length > 0 && currentAyah) {
      initializeQuestion(currentAyah, allSurahs);
    }
  }, [allSurahs, currentAyah, initializeQuestion]);
  
  useEffect(() => {
    if (allSurahs && allSurahs.length > 0 && !currentAyah && !gameEnded) {
      loadNextQuestion(allSurahs);
    }
  }, [allSurahs, currentAyah, gameEnded, loadNextQuestion]);
  
  const handleOptionSelect = (index: number) => {
    if (revealAnswer) return;
    setSelectedOption(index);
  };
  
  const handleConfirm = () => {
    if (selectedOption === null) {
      toast({
        title: "Please select an option",
        description: "You need to select a Surah before confirming",
        variant: "destructive"
      });
      return;
    }
    
    setRevealAnswer(true);
    
    if (currentAyah && options[selectedOption].number === currentAyah.surah.number) {
      incrementScore();
    } else {
      checkHighScore();
    }
  };
  
  const handleNext = () => {
    if (gameEnded) return;
    
    setSelectedOption(null);
    setRevealAnswer(false);
    
    const isCorrectAnswer = currentAyah && 
      selectedOption !== null && 
      options[selectedOption].number === currentAyah.surah.number;
    
    if (isCorrectAnswer) {
      loadNextQuestion(allSurahs || []);
      checkProgress();
    }
  };
  
  const handleStartNewGame = () => {
    resetGame();
    setSelectedOption(null);
    setRevealAnswer(false);
    loadNextQuestion(allSurahs || []);
  };
  
  if (isLoading || isLoadingSurahs) {
    return <LoadingSpinner message="Loading questions..." />;
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

  const isCorrectAnswer = currentAyah && 
    selectedOption !== null && 
    options[selectedOption].number === currentAyah.surah.number;
  
  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-5 mb-4">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-2xl font-bold text-primary">Identify the Surah</h2>
            <p className="text-sm text-gray-600 mt-1">Which Surah contains this Ayah?</p>
          </div>
          <div className="bg-primary text-white rounded-full h-10 px-4 flex items-center justify-center font-bold">
            Score: {score}
          </div>
        </div>
        
        {currentAyah && (
          <QuranText 
            arabicText={currentAyah.text}
            ayahRef={currentAyah.ayahRef}
          />
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {options.map((option, index) => (
            <SurahOption
              key={index}
              name={option.name}
              arabicName={option.arabicName}
              number={option.number}
              showNumber={revealAnswer}
              selected={selectedOption === index}
              correct={Boolean(revealAnswer && currentAyah && option.number === currentAyah.surah.number)}
              incorrect={Boolean(revealAnswer && selectedOption === index && currentAyah && option.number !== currentAyah.surah.number)}
              onClick={() => handleOptionSelect(index)}
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
          revealAnswer={revealAnswer}
          selectedOption={selectedOption}
          isLoadingNext={isLoadingNext}
          isCorrectAnswer={Boolean(isCorrectAnswer)}
          onConfirm={handleConfirm}
          onNext={handleNext}
          onEndGame={endGame}
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