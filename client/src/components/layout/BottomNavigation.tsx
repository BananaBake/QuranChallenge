import { Link } from "wouter";
import { 
  Home, 
  Search, 
  ArrowUpDown,
  Trophy
} from "lucide-react";

interface BottomNavigationProps {
  currentPath: string;
}

export default function BottomNavigation({ currentPath }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="w-full px-2">
        <div className="flex justify-around items-center h-16">
          <Link href="/">
            <div className={`flex flex-col items-center justify-center py-2 w-1/4 ${
              currentPath === "/" ? "text-primary" : "text-gray-500"
            }`}>
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1">Home</span>
            </div>
          </Link>
          
          <Link href="/identify-surah">
            <div className={`flex flex-col items-center justify-center py-2 w-1/4 ${
              currentPath === "/identify-surah" ? "text-primary" : "text-gray-500"
            }`}>
              <Search className="w-5 h-5" />
              <span className="text-xs mt-1">Identify</span>
            </div>
          </Link>
          
          <Link href="/surah-ordering">
            <div className={`flex flex-col items-center justify-center py-2 w-1/4 ${
              currentPath === "/surah-ordering" ? "text-primary" : "text-gray-500"
            }`}>
              <ArrowUpDown className="w-5 h-5" />
              <span className="text-xs mt-1">Ordering</span>
            </div>
          </Link>
          
          <Link href="/achievements">
            <div className={`flex flex-col items-center justify-center py-2 w-1/4 ${
              currentPath === "/achievements" ? "text-primary" : "text-gray-500"
            }`}>
              <Trophy className="w-5 h-5" />
              <span className="text-xs mt-1">Trophies</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
