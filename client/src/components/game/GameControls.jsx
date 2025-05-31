import React from "react"; // Added React import
import { Button } from "../ui"; // This should resolve to ui/index.js then ui/button.jsx
import { Check, Loader2 } from "lucide-react";

function LoadingButton({ 
  isLoading, 
  loadingText = "Loading...", 
  children, 
  onClick = () => {}, 
  disabled, 
  className = "bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base shadow-md" 
}) {
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
}) {
  if (revealAnswer !== undefined) {
    // Logic for Identify Surah game type (or similar with revealAnswer)
    return (
      <div className="flex justify-center mt-6">
        {!revealAnswer ? (
          <Button 
            className="bg-primary hover:bg-primary/90 text-white px-6 py-4 text-base shadow-md"
            onClick={onConfirm}
            disabled={selectedOption === null || selectedOption === undefined || isLoadingNext}
          >
            <Check className="w-5 h-5 mr-2" /> Confirm
          </Button>
        ) : !isCorrectAnswer ? (
          <Button
            className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-base shadow-md"
            onClick={onEndGame} // Assuming onEndGame here, as "See Results" implies ending.
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
  // Logic for Surah Ordering game type (or similar with checked/isCorrect)
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
          onClick={onSeeResults} // Assuming onSeeResults is for this path
          disabled={isLoadingNext || gameEnded}
        >
          See Results
        </Button>
      ) : (
        <LoadingButton
          isLoading={isLoadingNext}
          onClick={onNext} // Assuming onNext is for this path as well
        >
          Next Challenge
        </LoadingButton>
      )}
    </div>
  );
}
