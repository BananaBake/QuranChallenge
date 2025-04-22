import { Link } from "wouter";
import { memo } from "react";
import { 
  Home, 
  Search, 
  ArrowUpDown,
  Trophy,
  LucideIcon
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

const NavItem = memo(({ href, icon: Icon, label, isActive }: NavItemProps) => (
  <Link href={href}>
    <div className={`flex flex-col items-center justify-center py-2 w-1/4 
      ${isActive ? "text-primary font-medium" : "text-gray-500"} 
      hover:text-primary/80 transition-colors duration-200`}>
      <div className="relative">
        <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
        {isActive && (
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
        )}
      </div>
      <span className={`text-xs mt-1 ${isActive ? "font-medium" : ""}`}>{label}</span>
      {isActive && <div className="absolute top-0 w-full h-0.5 bg-primary"></div>}
    </div>
  </Link>
));

NavItem.displayName = "NavItem";

interface BottomNavigationProps {
  currentPath: string;
}

export default function BottomNavigation({ currentPath }: BottomNavigationProps) {
  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/identify-surah", icon: Search, label: "Identify" },
    { href: "/surah-ordering", icon: ArrowUpDown, label: "Ordering" },
    { href: "/achievements", icon: Trophy, label: "Trophies" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="w-full px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map(item => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={currentPath === item.href}
            />
          ))}
        </div>
      </div>
      <div className="absolute -top-3 left-0 right-0 h-3 bg-gradient-to-t from-white/90 to-transparent"></div>
    </nav>
  );
}
