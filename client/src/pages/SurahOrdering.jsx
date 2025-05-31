import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { LoadingSpinner, DraggableSurah } from "@/components/ui";
import { useGameState, useSurahOrderingData, useAchievementNotifications } from "@/hooks";
import { GameResult, GameControls, GameHeader, GameStatsBar } from "@/components";
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
        gameModeName="round"
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
        <GameHeader
          title="Surah Ordering"
          subtitle="Arrange the Surahs in correct order"
          score={score}
        />
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
      <GameStatsBar 
        previousHighScore={previousHighScore}
        currentScore={score}
        formattedTime={formattedTime}
      />
    </div>
  );
}