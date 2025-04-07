import { Moon } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <header className="bg-primary text-white py-4 px-4 text-center relative">
      <h1 className="text-2xl font-bold">
        <span className="font-english">Quran Learning Game</span>
      </h1>
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <button 
          className="w-8 h-8 flex items-center justify-center"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          <Moon className="text-secondary w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
