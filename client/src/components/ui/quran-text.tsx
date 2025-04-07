import { ArabesqueBorder } from "./arabesque-border";

interface QuranTextProps {
  arabicText: string;
  translationText: string;
}

export function QuranText({ arabicText, translationText }: QuranTextProps) {
  return (
    <ArabesqueBorder className="mb-6">
      <div className="p-4">
        <p className="font-arabic text-right text-2xl leading-loose mb-4" dir="rtl">
          {arabicText}
        </p>
        <p className="text-sm text-gray-600 italic">
          {translationText}
        </p>
      </div>
    </ArabesqueBorder>
  );
}
