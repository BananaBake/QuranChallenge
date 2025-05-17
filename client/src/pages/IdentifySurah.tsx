import { useState, useEffect } from "react";
import { useSurahs } from "@/hooks/useQuranData";
import { Button } from "@/components/ui/button";
import { QuranText } from "@/components/ui/quran-text";
import { SurahOption } from "@/components/ui/surah-option";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Loader2, AlertCircle } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { useIdentifySurahData } from "@/hooks/useGameData";
import { useAchievementNotifications } from "@/hooks/useAchievements";

// Import reusable components
import { 
  GameResult, 
  GameControls, 
  GameHeader, 
  GameStatsBar 
} from "@/components/game";

export default function IdentifySurah() {
  const { data: allSurahs, isLoading: isLoadingSurahs } = useSurahs();
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
    error,
    setError,
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
      setError("You need to select a Surah before confirming");
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
    
    if (isCorrectAnswer && allSurahs) {
      loadNextQuestion(allSurahs);
      checkProgress();
    }
  };
  
  const handleStartNewGame = () => {
    resetGame();
    setSelectedOption(null);
    setRevealAnswer(false);
    if (allSurahs) {
      loadNextQuestion(allSurahs);
    }
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
        gameModeName="Surah"
      />
    );
  }

  const isCorrectAnswer = currentAyah && 
    selectedOption !== null && 
    options[selectedOption].number === currentAyah.surah.number;
  
  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-5 mb-4">
        <GameHeader
          title="Identify the Surah"
          subtitle="Which Surah contains this Ayah?"
          score={score}
        />
        
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
        
        {error && (
          <div className="flex items-center p-4 my-4 bg-destructive/10 text-destructive rounded-lg">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto" 
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
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
      
      <GameStatsBar 
        previousHighScore={previousHighScore}
        currentScore={score}
        formattedTime={formattedTime}
      />
    </div>
  );
}