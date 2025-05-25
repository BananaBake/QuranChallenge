import { Button } from "../ui";
import { Check, Loader2 } from "lucide-react";
import { ReactNode } from "react";
interface LoadingButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}
function LoadingButton({ 
  isLoading, 
  loadingText = "Loading...", 
  children, 
  onClick = () => {}, 
  disabled, 
  className = "bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base shadow-md" 
}: LoadingButtonProps) {
  return (
    <Button
      className={className}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="flex items-center">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
export interface GameControlsProps {
  isLoadingNext: boolean;
  revealAnswer?: boolean;
  selectedOption?: number | null;
  isCorrectAnswer?: boolean;
  onConfirm?: () => void;
  onNext?: () => void;
  onEndGame?: () => void;
  checked?: boolean;
  isCorrect?: boolean;
  gameEnded?: boolean;
  onCheckOrder?: () => void;
  onSeeResults?: () => void;
}
export function GameControls({ 
  isLoadingNext,
  revealAnswer,
  selectedOption,
  isCorrectAnswer,
  onConfirm,
  onNext,
  onEndGame,
  checked,
  isCorrect,
  gameEnded,
  onCheckOrder,
  onSeeResults
}: GameControlsProps) {
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
          <LoadingButton
            isLoading={isLoadingNext}
            onClick={onNext}
          >
            Next Question
          </LoadingButton>
        )}
      </div>
    );
  }
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
        <LoadingButton
          isLoading={isLoadingNext}
          onClick={onNext}
        >
          Next Challenge
        </LoadingButton>
      )}
    </div>
  );
}