import { cn } from "@/lib/utils";

interface SurahOptionProps {
  name: string;
  arabicName: string;
  selected?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  onClick: () => void;
}

export function SurahOption({ 
  name, 
  arabicName, 
  selected = false, 
  correct = false, 
  incorrect = false,
  onClick 
}: SurahOptionProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "border rounded-lg p-3 text-center transition duration-200 w-full",
        {
          "border-gray-300 hover:bg-secondary/10": !selected && !correct && !incorrect,
          "border-primary bg-primary/10": selected && !correct && !incorrect,
          "border-green-500 bg-green-100": correct,
          "border-red-500 bg-red-100": incorrect
        }
      )}
    >
      <span className="font-bold">{name}</span>
      <span className="block text-xs text-gray-500">{arabicName}</span>
    </button>
  );
}
