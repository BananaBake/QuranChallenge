import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

export interface GameControlsProps {
  // Common controls props
  isLoadingNext: boolean;
  
  // Identify Surah specific props
  revealAnswer?: boolean;
  selectedOption?: number | null;
  isCorrectAnswer?: boolean;
  onConfirm?: () => void;
  onNext?: () => void;
  onEndGame?: () => void;
  
  // Surah Ordering specific props
  checked?: boolean;
  isCorrect?: boolean;
  gameEnded?: boolean;
  onCheckOrder?: () => void;
  onSeeResults?: () => void;
}

export function GameControls({ 
  // Common props
  isLoadingNext,
  
  // Identify Surah props
  revealAnswer,
  selectedOption,
  isCorrectAnswer,
  onConfirm,
  onNext,
  onEndGame,
  
  // Surah Ordering props
  checked,
  isCorrect,
  gameEnded,
  onCheckOrder,
  onSeeResults
}: GameControlsProps) {
  
  // Identify Surah mode
  if (revealAnswer !== undefined) {
    return (
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
  }
  
  // Surah Ordering mode
  return (
    <div className="flex justify-center mt-6">
      {!checked ? (
        <Button 
          className="bg-primary hover:bg-primary/90 text-white px-6 py-4 text-base shadow-md"
          onClick={onCheckOrder}
          disabled={isLoadingNext}
        >
          <Check className="w-5 h-5 mr-2" /> Check Order
        </Button>
      ) : !isCorrect ? (
        <Button
          className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-base shadow-md"
          onClick={onSeeResults}
          disabled={isLoadingNext || gameEnded}
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
            'Next Challenge'
          )}
        </Button>
      )}
    </div>
  );
}