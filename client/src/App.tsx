import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { memo, useEffect, useState } from "react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { AchievementNotificationsContainer } from "@/components/achievements/AchievementDisplay";
import { getNewlyUnlockedAchievements, type Achievement } from "@/lib/trophyService";

// Import page components directly to avoid lazy loading issues
import Home from "@/pages/Home";
import IdentifySurah from "@/pages/IdentifySurah";
import SurahOrdering from "@/pages/SurahOrdering";
import Achievements from "@/pages/Achievements";
import NotFound from "@/pages/not-found";

const AppRoutes = memo(() => {
  const [location] = useLocation();

  return (
    <>
      <main className="p-4 pb-20 w-full">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/identify-surah" component={IdentifySurah} />
          <Route path="/surah-ordering" component={SurahOrdering} />
          <Route path="/achievements" component={Achievements} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <BottomNavigation currentPath={location} />
    </>
  );
});

AppRoutes.displayName = "AppRoutes";

function App() {
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  
  // Check for newly unlocked achievements periodically
  useEffect(() => {
    // Initial check on mount
    const checkAchievements = () => {
      const unlocked = getNewlyUnlockedAchievements();
      if (unlocked.length > 0) {
        setNewAchievements(unlocked);
      }
    };
    
    checkAchievements();
    
    // Set up interval to check periodically (every 2 seconds)
    const intervalId = setInterval(checkAchievements, 2000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="islamic-pattern min-h-screen bg-background text-textColor font-english relative">
        <div className="w-full relative min-h-screen pb-16">
          <AppRoutes />
          <Toaster />
          <AchievementNotificationsContainer achievements={newAchievements} />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
