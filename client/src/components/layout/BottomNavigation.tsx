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
  <Link href={href} className="w-1/4">
    <div className={`flex flex-col items-center justify-center py-2 px-4 w-full h-full
      ${isActive ? "text-primary" : "text-gray-500"} 
      hover:text-primary/80 transition-colors duration-200`}>
      <Icon className="w-5 h-5" />
      <span className="text-xs mt-1">{label}</span>
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
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
    </nav>
  );
}
