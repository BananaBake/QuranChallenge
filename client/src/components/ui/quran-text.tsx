import { ArabesqueBorder } from "./arabesque-border";

interface QuranTextProps {
  arabicText: string;
}

export function QuranText({ 
  arabicText
}: QuranTextProps) {
  return (
    <ArabesqueBorder className="mb-6">
      <div className="p-6 text-center">
        <p 
          className="font-arabic text-center text-3xl leading-relaxed text-primary" 
          dir="rtl"
          style={{ 
            fontWeight: 700, 
            lineHeight: 1.8,
            fontFamily: "'Uthmanic', 'Scheherazade New', serif"
          }}
        >
          {arabicText}
        </p>
      </div>
    </ArabesqueBorder>
  );
}
