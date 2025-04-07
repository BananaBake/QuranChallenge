import { BookOpen } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-primary text-white py-4 px-4 text-center relative shadow-md">
      <div className="absolute inset-0 opacity-10 islamic-pattern"></div>
      <div className="flex items-center justify-center relative z-10">
        <BookOpen className="text-secondary w-6 h-6 mr-2" />
        <h1 className="text-2xl font-bold">
          <span className="font-english">Quran Challenge</span>
        </h1>
      </div>
    </header>
  );
}
