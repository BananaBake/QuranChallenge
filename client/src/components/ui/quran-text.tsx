import { ArabesqueBorder } from "./arabesque-border";

interface QuranTextProps {
  arabicText: string;
  translationText?: string;
  showTranslation?: boolean;
}

export function QuranText({ 
  arabicText, 
  translationText, 
  showTranslation = false 
}: QuranTextProps) {
  return (
    <ArabesqueBorder className="mb-6">
      <div className="p-6 text-center">
        <p 
          className="font-arabic text-center text-3xl leading-relaxed text-primary" 
          dir="rtl"
          style={{ fontWeight: 700, lineHeight: 1.8 }}
        >
          {arabicText}
        </p>
        
        {showTranslation && translationText && (
          <p className="mt-4 text-md text-gray-700 italic px-4">
            {translationText}
          </p>
        )}
      </div>
    </ArabesqueBorder>
  );
}
