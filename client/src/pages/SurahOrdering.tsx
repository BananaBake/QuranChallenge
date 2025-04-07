import { useState, useEffect } from "react";
import { useRandomSurahsForGame } from "@/hooks/useQuranData";
import { useSaveGameResult, useGameStats } from "@/hooks/useGameStats";
import { Button } from "@/components/ui/button";
import { DraggableSurah } from "@/components/ui/draggable-surah";
import { Check, Trophy, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Surah } from "@shared/schema";

export default function SurahOrdering() {
  const { data: originalSurahs, isLoading, refetch } = useRandomSurahsForGame(5);
  const { data: stats } = useGameStats();
  const { mutate: saveGameResult } = useSaveGameResult();
  const { toast } = useToast();
  
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timer, setTimer] = useState("00:00");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [previousHighScore, setPreviousHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  
  // Endless mode - no fixed number of questions
  
  // Get the best previous score for this mode
  useEffect(() => {
    if (stats && stats.modePerformance) {
      setPreviousHighScore(stats.modePerformance.surahOrdering || 0);
    }
  }, [stats]);
  
  useEffect(() => {
    if (originalSurahs && originalSurahs.length > 0) {
      // Create a shuffled copy
      const shuffled = [...originalSurahs].sort(() => Math.random() - 0.5);
      setSurahs(shuffled);
      
      if (!startTime) {
        setStartTime(new Date());
      }
    }
  }, [originalSurahs, startTime]);
  
  useEffect(() => {
    if (!startTime || gameEnded) return;
    
    const intervalId = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setTimeSpent(diff);
      
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [startTime, gameEnded]);
  
  const handleMoveItem = (dragIndex: number, hoverIndex: number) => {
    if (checked) return; // Disable reordering after checking
    
    const dragItem = surahs[dragIndex];
    const newItems = [...surahs];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    setSurahs(newItems);
  };
  
  const handleCheckOrder = () => {
    setChecked(true);
    
    // Check if the order is correct (sorted by surah number)
    const isOrderCorrect = [...surahs]
      .every((surah, index, array) => 
        index === 0 || surah.number > array[index - 1].number
      );
    
    setIsCorrect(isOrderCorrect);
    
    if (isOrderCorrect) {
      setScore(prev => prev + 1);
    } else {
      // Incorrect answer - game over in endless mode
      setTimeout(() => {
        setGameEnded(true);
        
        // Save game result
        saveGameResult({
          userId: 1, // Default user ID
          gameType: "surah_ordering",
          score,
          maxScore: score, // In endless mode, max score is the score achieved
          timeSpent
        });
        
        // Check if this is a new high score
        if (score > previousHighScore) {
          setIsNewHighScore(true);
          toast({
            title: "New High Score!",
            description: `Congratulations! You've beaten your previous best of ${previousHighScore}!`,
            variant: "default",
          });
        }
      }, 1500);
    }
  };
  
  const handleNext = () => {
    if (gameEnded) return;
    
    setChecked(false);
    
    // Only continue if the answer was correct
    if (isCorrect) {
      setCurrentQuestionIndex(prev => prev + 1);
      refetch();
    }
  };
  
  const handleStartNewGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameEnded(false);
    setStartTime(new Date());
    setTimeSpent(0);
    setTimer("00:00");
    setChecked(false);
    refetch();
  };
  
  if (isLoading) {
    return <div className="text-center p-8">Loading questions...</div>;
  }
  
  if (gameEnded) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">{isNewHighScore ? '🏆 New High Score!' : 'Game Over!'}</h2>
        
        {isNewHighScore && (
          <p className="text-accent font-bold mb-4">
            Congratulations! You've beaten your previous best score!
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
            <span className="font-bold text-xl text-accent">{timer}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          You correctly ordered {score} {score === 1 ? 'round' : 'rounds'} of Surahs.
          {isNewHighScore && ' Keep going to improve your knowledge!'}
        </p>
        
        <Button 
          className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base shadow-md"
          onClick={handleStartNewGame}
        >
          Play Again
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-5 mb-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-2xl font-bold text-primary">Surah Ordering</h2>
            <p className="text-sm text-gray-600 mt-1">Arrange the Surahs in correct order</p>
          </div>
          <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
            <span>{currentQuestionIndex + 1}</span>/<span>{totalQuestions}</span>
          </div>
        </div>
        
        <div className={`p-3 text-center mb-6 rounded-lg ${
          checked 
            ? (isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")
            : "bg-primary/10 text-primary"
        }`}>
          <p className="font-medium">
            {checked 
              ? isCorrect 
                ? "✓ Correct! Your order is perfect."
                : "✗ Incorrect. The correct order is from lowest to highest surah number."
              : "Drag and drop the Surahs to arrange them in the correct Qur'anic order (from lowest to highest number)"
            }
          </p>
        </div>
        
        <div className="space-y-2 mb-6">
          {surahs.map((surah, index) => (
            <DraggableSurah
              key={surah.number}
              name={surah.englishName}
              arabicName={surah.name}
              number={surah.number}
              index={index}
              onMoveItem={handleMoveItem}
              showNumber={checked}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          {!checked ? (
            <Button 
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={handleCheckOrder}
            >
              <Check className="w-4 h-4 mr-1" /> Check Order
            </Button>
          ) : (
            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={handleNext}
            >
              {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Game'}
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 text-sm">
        <div>
          <span className="text-primary font-bold">Score: </span>
          <span>{score}</span>/<span>{totalQuestions}</span>
        </div>
        <div>
          <span className="text-accent font-bold">Time: </span>
          <span>{timer}</span>
        </div>
      </div>
    </div>
  );
}
