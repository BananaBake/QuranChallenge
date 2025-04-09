import { useState, useEffect, useCallback } from "react";
import { useRandomAyahsForGame, useSurahs } from "@/hooks/useQuranData";
import { useSaveGameResult, useGameStats } from "@/hooks/useGameStats";
import { Button } from "@/components/ui/button";
import { QuranText } from "@/components/ui/quran-text";
import { SurahOption } from "@/components/ui/surah-option";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Check, Trophy, Clock, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Ayah, Surah } from "@shared/schema";
import { getNewlyUnlockedAchievements, checkAchievementsProgress, getAchievements, saveAchievements, incrementHighScoreBeatenCount } from "@/lib/localStorageService";

export default function IdentifySurah() {
  const { data: ayahs, isLoading, refetch } = useRandomAyahsForGame(5);
  const { data: allSurahs, isLoading: isLoadingSurahs } = useSurahs();
  const { data: stats } = useGameStats();
  const { mutate: saveGameResult } = useSaveGameResult();
  const { toast } = useToast();
  
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timer, setTimer] = useState("00:00");
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [options, setOptions] = useState<Array<{ name: string, arabicName: string, number: number }>>([]);
  const [previousHighScore, setPreviousHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isLoadingNextQuestion, setIsLoadingNextQuestion] = useState(false);
  
  // Get the best previous score for this mode
  useEffect(() => {
    if (stats && stats.modePerformance) {
      setPreviousHighScore(stats.modePerformance.identifySurah || 0);
    }
  }, [stats]);
  
  // Start timer when the game starts
  useEffect(() => {
    if (!startTime && !gameEnded) {
      setStartTime(new Date());
    }
  }, [startTime, gameEnded]);
  
  // Timer logic
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
  
  // Initialize the first question when data is loaded
  useEffect(() => {
    if (ayahs && ayahs.length > 0 && !currentAyah) {
      setCurrentAyah(ayahs[0]);
      generateOptionsForCurrentAyah(ayahs[0], allSurahs || []);
    }
  }, [ayahs, allSurahs, currentAyah]);
  
  // Function to generate random options for a given ayah
  const generateOptionsForCurrentAyah = useCallback((ayah: Ayah, surahs: Surah[]) => {
    if (!ayah || surahs.length === 0) return;
    
    // Get all available surahs excluding the correct one
    const availableSurahs = surahs.filter(s => s.number !== ayah.surah.number);
    
    // Get 3 random incorrect options
    const incorrectOptions: Array<{ name: string, arabicName: string, number: number }> = [];
    const usedIndices = new Set<number>();
    
    while (incorrectOptions.length < 3 && incorrectOptions.length < availableSurahs.length) {
      const randomIndex = Math.floor(Math.random() * availableSurahs.length);
      
      if (!usedIndices.has(randomIndex)) {
        incorrectOptions.push({
          name: availableSurahs[randomIndex].englishName,
          arabicName: availableSurahs[randomIndex].name,
          number: availableSurahs[randomIndex].number
        });
        usedIndices.add(randomIndex);
      }
    }
    
    // Add the correct option
    const correctOption = {
      name: ayah.surah.englishName,
      arabicName: ayah.surah.name,
      number: ayah.surah.number
    };
    
    // Insert the correct option at a random position
    const position = Math.floor(Math.random() * 4);
    incorrectOptions.splice(position, 0, correctOption);
    
    setOptions(incorrectOptions);
  }, []);
  
  // Function to get the next question with completely random options
  const getNextQuestion = useCallback(async () => {
    setIsLoadingNextQuestion(true);
    try {
      // Fetch a new random ayah
      const response = await fetch('/api/quran/random-ayahs?count=1');
      const data = await response.json();
      
      if (data && data.length > 0) {
        setCurrentAyah(data[0]);
        // Generate completely new random options for this ayah
        generateOptionsForCurrentAyah(data[0], allSurahs || []);
        
        // Check for achievements progress during gameplay
        const newAchievements = checkAchievementsProgress();
        
        // Show notifications for newly unlocked achievements immediately
        newAchievements.forEach(achievement => {
          toast({
            title: "🏆 Achievement Unlocked!",
            description: `${achievement.title}: ${achievement.description}`,
            variant: "default",
          });
        });
      }
    } catch (error) {
      console.error("Failed to fetch next question:", error);
      toast({
        title: "Error",
        description: "Failed to fetch the next question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingNextQuestion(false);
    }
  }, [allSurahs, generateOptionsForCurrentAyah, toast]);
  
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
      // Correct answer - Increment score first
      const newScore = score + 1;
      setScore(newScore);
      
      // Update a temporary game result in memory to check for achievements
      // But don't save it to history yet (we'll do that at game end)
      const tempGameData = {
        userId: 1,
        gameType: "identify_surah",
        score: newScore,
        maxScore: newScore,
        completedAt: new Date()
      };
      
      // First, check specifically for streak achievements
      const streakAchievements = ['streak_5', 'streak_10', 'identify_master'];
      const currentAchievements = getAchievements();
      
      // Update streak-based achievements without adding to game history
      streakAchievements.forEach(achievementId => {
        const achievement = currentAchievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
          let shouldUnlock = false;
          
          // Check unlock conditions
          if (achievementId === 'identify_master' && newScore >= 7) {
            shouldUnlock = true;
          } else if (achievementId === 'streak_5' && newScore >= 5) {
            shouldUnlock = true;
          } else if (achievementId === 'streak_10' && newScore >= 10) {
            shouldUnlock = true;
          }
          
          // Unlock if conditions met
          if (shouldUnlock) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
            achievement.progress = newScore;
            
            // Show achievement toast right away
            toast({
              title: "🏆 Achievement Unlocked!",
              description: `${achievement.title}: ${achievement.description}`,
              variant: "default",
            });
          } else {
            // Just update progress
            achievement.progress = Math.max(achievement.progress || 0, newScore);
          }
        }
      });
      
      // Save updated achievements
      saveAchievements(currentAchievements);
    } else {
      // Incorrect answer - but let the player see the correct answer before ending
      // Game will end when they click the "End Game" button
      
      // Find the correct option to highlight it
      const correctSurahOption = options.find(option => 
        currentAyah && option.number === currentAyah.surah.number
      );
      
      // Removed toast notification on incorrect answer - visual cues are enough
      // We'll save the game result when user clicks "See Results"
      
      // Check if this is a new high score
      if (score > previousHighScore) {
        setIsNewHighScore(true);
        
        // Increment the high score beaten count for achievements
        const newCount = incrementHighScoreBeatenCount();
        
        // Check for new high score achievements
        const highScoreAchievements = checkAchievementsProgress();
        
        toast({
          title: "New High Score!",
          description: `Congratulations! You've beaten your previous best of ${previousHighScore}!`,
          variant: "default",
        });
        
        // Show notifications for any newly unlocked high score achievements
        highScoreAchievements
          .filter(a => a.id.startsWith('highscore_'))
          .forEach(achievement => {
            toast({
              title: "🏆 Achievement Unlocked!",
              description: `${achievement.title}: ${achievement.description}`,
              variant: "default",
            });
          });
      }
    }
  };
  
  const handleNext = () => {
    if (gameEnded) return;
    
    setSelectedOption(null);
    setRevealAnswer(false);
    
    if (currentAyah && options.some(option => option.number === currentAyah.surah.number) && 
        selectedOption !== null && options[selectedOption].number === currentAyah.surah.number) {
      // If answer was correct, get the next question
      getNextQuestion();
    }
  };
  
  // Skip function removed for endless mode
  
  const handleStartNewGame = () => {
    // Don't save the game when Play Again is clicked - we already saved at the fail point
    
    // Reset game state
    setSelectedOption(null);
    setScore(0);
    setGameEnded(false);
    setStartTime(new Date());
    setTimeSpent(0);
    setTimer("00:00");
    setRevealAnswer(false);
    setIsNewHighScore(false);
    setCurrentAyah(null);
    
    // Get a completely new random ayah instead of using refetch
    // to ensure we don't get the same first question
    getNextQuestion();
  };
  
  if (isLoading || isLoadingSurahs) {
    return <LoadingSpinner message="Loading questions..." />;
  }
  
  if (gameEnded) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">{isNewHighScore ? '🏆 New High Score!' : 'Great Effort!'}</h2>
        
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
            <span className="font-bold text-xl text-accent">{timer}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          You correctly identified {score} {score === 1 ? 'Surah' : 'Surahs'}.
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
        
        {isLoadingNextQuestion && (
          <div className="flex items-center justify-center p-4 mt-4 bg-primary/10 text-primary rounded-lg">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Loading next challenge...</span>
          </div>
        )}
        
        <div className="flex justify-center mt-6">
          {!revealAnswer ? (
            <Button 
              className="bg-primary hover:bg-primary/90 text-white px-6 py-4 text-base shadow-md"
              onClick={handleConfirm}
              disabled={selectedOption === null || isLoadingNextQuestion}
            >
              <Check className="w-5 h-5 mr-2" /> Confirm
            </Button>
          ) : selectedOption !== null && currentAyah && options[selectedOption].number !== currentAyah.surah.number ? (
            <Button
              className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-base shadow-md"
              onClick={() => {
                // Save game result and check for game-played achievements when ending the game
                saveGameResult({
                  userId: 1,
                  gameType: "identify_surah",
                  score,
                  maxScore: score,
                  timeSpent
                });
                
                // Check for game completion achievements (like first_game and games_10)
                const playedAchievements = checkAchievementsProgress();
                playedAchievements
                  .filter(a => a.id === 'first_game' || a.id === 'games_10')
                  .forEach(achievement => {
                    toast({
                      title: "🏆 Achievement Unlocked!",
                      description: `${achievement.title}: ${achievement.description}`,
                      variant: "default",
                    });
                  });
                
                setGameEnded(true);
              }}
              disabled={isLoadingNextQuestion}
            >
              See Results
            </Button>
          ) : (
            <Button
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base shadow-md"
              onClick={handleNext}
              disabled={gameEnded || isLoadingNextQuestion}
            >
              {isLoadingNextQuestion ? (
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
      </div>
      
      <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Trophy className="w-4 h-4 text-secondary mr-1" />
          <span className="text-sm">Best: {previousHighScore > score ? previousHighScore : score}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-primary mr-1" />
          <span className="text-sm">Time: {timer}</span>
        </div>
      </div>
    </div>
  );
}
