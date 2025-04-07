import { Link } from "wouter";
import { 
  Home, 
  Search, 
  ArrowUpDown, 
  BarChart3
} from "lucide-react";

interface BottomNavigationProps {
  currentPath: string;
}

export default function BottomNavigation({ currentPath }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg relative z-50">
      <div className="w-full px-2">
        <div className="flex justify-around items-center h-16">
          <Link href="/">
            <a className={`flex flex-col items-center justify-center py-2 w-1/4 ${
              currentPath === "/" ? "text-primary" : "text-gray-500"
            }`}>
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1">Home</span>
            </a>
          </Link>
          
          <Link href="/identify-surah">
            <a className={`flex flex-col items-center justify-center py-2 w-1/4 ${
              currentPath === "/identify-surah" ? "text-primary" : "text-gray-500"
            }`}>
              <Search className="w-5 h-5" />
              <span className="text-xs mt-1">Identify</span>
            </a>
          </Link>
          
          <Link href="/surah-ordering">
            <a className={`flex flex-col items-center justify-center py-2 w-1/4 ${
              currentPath === "/surah-ordering" ? "text-primary" : "text-gray-500"
            }`}>
              <ArrowUpDown className="w-5 h-5" />
              <span className="text-xs mt-1">Ordering</span>
            </a>
          </Link>
          
          <Link href="/statistics">
            <a className={`flex flex-col items-center justify-center py-2 w-1/4 ${
              currentPath === "/statistics" ? "text-primary" : "text-gray-500"
            }`}>
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs mt-1">Stats</span>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
