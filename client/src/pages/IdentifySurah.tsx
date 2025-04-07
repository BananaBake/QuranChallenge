import { useState, useEffect } from "react";
import { useRandomAyahsForGame } from "@/hooks/useQuranData";
import { useSaveGameResult } from "@/hooks/useGameStats";
import { Button } from "@/components/ui/button";
import { QuranText } from "@/components/ui/quran-text";
import { SurahOption } from "@/components/ui/surah-option";
import { Check, SkipForward } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Ayah } from "@shared/schema";

export default function IdentifySurah() {
  const { data: ayahs, isLoading, refetch } = useRandomAyahsForGame(10);
  const { mutate: saveGameResult } = useSaveGameResult();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timer, setTimer] = useState("00:00");
  const [revealAnswer, setRevealAnswer] = useState(false);
  
  const currentQuestion = ayahs?.[currentQuestionIndex];
  const totalQuestions = ayahs?.length || 0;
  
  useEffect(() => {
    if (ayahs && ayahs.length > 0 && !startTime) {
      setStartTime(new Date());
    }
  }, [ayahs, startTime]);
  
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
  
  const generateOptions = (correct: Ayah): { name: string, arabicName: string, number: number }[] => {
    if (!ayahs) return [];
    
    // Create a pool of surahs excluding the correct one
    const surahPool = ayahs
      .filter(ayah => ayah.surah.number !== correct.surah.number)
      .map(ayah => ({
        name: ayah.surah.englishName,
        arabicName: ayah.surah.name,
        number: ayah.surah.number
      }));
    
    // Randomly select 3 distinct surahs
    const randomOptions: { name: string, arabicName: string, number: number }[] = [];
    while (randomOptions.length < 3 && surahPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * surahPool.length);
      const option = surahPool[randomIndex];
      
      if (!randomOptions.some(o => o.number === option.number)) {
        randomOptions.push(option);
      }
      
      surahPool.splice(randomIndex, 1);
    }
    
    // Add the correct option
    const correctOption = {
      name: correct.surah.englishName,
      arabicName: correct.surah.name,
      number: correct.surah.number
    };
    
    // Insert the correct option at a random position
    const position = Math.floor(Math.random() * 4);
    randomOptions.splice(position, 0, correctOption);
    
    return randomOptions;
  };
  
  const options = currentQuestion ? generateOptions(currentQuestion) : [];
  
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
    
    if (currentQuestion && options[selectedOption].number === currentQuestion.surah.number) {
      setScore(prev => prev + 1);
    }
  };
  
  const handleNext = () => {
    setSelectedOption(null);
    setRevealAnswer(false);
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameEnded(true);
      
      saveGameResult({
        userId: 1, // Default user ID
        gameType: "identify_surah",
        score,
        maxScore: totalQuestions,
        timeSpent
      });
      
      toast({
        title: "Game Completed!",
        description: `You scored ${score} out of ${totalQuestions}`,
      });
    }
  };
  
  const handleSkip = () => {
    setRevealAnswer(true);
  };
  
  const handleStartNewGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setGameEnded(false);
    setStartTime(new Date());
    setTimeSpent(0);
    setTimer("00:00");
    setRevealAnswer(false);
    refetch();
  };
  
  if (isLoading) {
    return <div className="text-center p-8">Loading questions...</div>;
  }
  
  if (gameEnded) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Game Completed!</h2>
        <p className="text-lg mb-6">
          Your Score: <span className="font-bold text-primary">{score}</span> / {totalQuestions}
        </p>
        <p className="text-md mb-6">
          Time Taken: <span className="font-bold text-accent">{timer}</span>
        </p>
        <Button 
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={handleStartNewGame}
        >
          Play Again
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-primary">Identify the Surah</h2>
            <p className="text-sm text-gray-600">Which Surah contains this Ayah?</p>
          </div>
          <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center">
            <span>{currentQuestionIndex + 1}</span>/<span>{totalQuestions}</span>
          </div>
        </div>
        
        {currentQuestion && (
          <QuranText 
            arabicText={currentQuestion.text}
            translationText={currentQuestion.translation || 'Translation not available'}
          />
        )}
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {options.map((option, index) => (
            <SurahOption
              key={index}
              name={option.name}
              arabicName={option.arabicName}
              selected={selectedOption === index}
              correct={revealAnswer && currentQuestion && option.number === currentQuestion.surah.number}
              incorrect={revealAnswer && selectedOption === index && currentQuestion && option.number !== currentQuestion.surah.number}
              onClick={() => handleOptionSelect(index)}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          {!revealAnswer ? (
            <>
              <Button 
                className="bg-accent hover:bg-accent/90 text-white mr-3"
                onClick={handleSkip}
              >
                <SkipForward className="w-4 h-4 mr-1" /> Skip
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={handleConfirm}
                disabled={selectedOption === null}
              >
                <Check className="w-4 h-4 mr-1" /> Confirm
              </Button>
            </>
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
