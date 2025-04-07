import { ArabesqueBorder } from "./arabesque-border";

interface QuranTextProps {
  arabicText: string;
  translationText: string;
}

export function QuranText({ arabicText, translationText }: QuranTextProps) {
  return (
    <ArabesqueBorder className="mb-6">
      <div className="p-6 text-center">
        <p 
          className="font-['Amiri','Scheherazade_New',serif] text-center text-3xl leading-relaxed mb-6 text-primary" 
          dir="rtl"
          style={{ fontWeight: 700, lineHeight: 1.8 }}
        >
          {arabicText}
        </p>
        <p className="text-sm text-gray-700 font-medium italic">
          {translationText}
        </p>
      </div>
    </ArabesqueBorder>
  );
}
