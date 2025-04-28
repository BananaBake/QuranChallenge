import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { memo, useEffect, useState } from "react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { AchievementNotificationsContainer } from "@/components/achievements/AchievementDisplay";
import { getNewlyUnlockedAchievements, type Achievement } from "@/lib/trophyService";
import { AlertMessagesContainer, useAlertMessage } from "@/components/ui/alert-message";

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
  const { messages, showMessage, dismissMessage } = useAlertMessage();
  
  // Check for new achievements and create a custom event listener to detect them
  useEffect(() => {
    // Create the achievement check function
    const checkForUnlockedAchievements = () => {
      const unlocked = getNewlyUnlockedAchievements();
      if (unlocked.length > 0) {
        console.log("Found new achievements in App:", unlocked.map(a => a.title).join(", "));
        
        // Filter out achievements already being displayed
        const newUnlockedIds = unlocked.map(a => a.id);
        const uniqueAchievements = unlocked.filter(
          // Filter out achievements already in the queue
          a => !newAchievements.some(existing => existing.id === a.id)
        );
        
        if (uniqueAchievements.length > 0) {
          setNewAchievements(prev => [...prev, ...uniqueAchievements]);
        }
      }
    };
    
    // Check on mount with a small delay to ensure app is fully initialized
    const initialCheckTimer = setTimeout(() => {
      checkForUnlockedAchievements();
    }, 1000);
    
    // Create a custom event handler for game completion
    const handleGameComplete = () => {
      // Check immediately after game completion
      checkForUnlockedAchievements();
    };
    
    // Register event
    window.addEventListener('gameComplete', handleGameComplete);
    
    return () => {
      window.removeEventListener('gameComplete', handleGameComplete);
      clearTimeout(initialCheckTimer);
    };
  }, [newAchievements]);
  
  // We don't need to clear achievements as the AchievementNotificationsContainer
  // handles this internally by queueing and processing them one by one
  
  // Provide the alert message context to the entire app
  // so it can be accessed from any component
  useEffect(() => {
    // Expose the showMessage function to the window object
    // for global error handling
    window.showAlertMessage = showMessage;
    
    return () => {
      delete window.showAlertMessage;
    };
  }, [showMessage]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="islamic-pattern min-h-screen bg-background text-textColor font-english relative">
        <div className="w-full relative min-h-screen pb-16">
          <AppRoutes />
          <AlertMessagesContainer messages={messages} onDismiss={dismissMessage} />
          <AchievementNotificationsContainer achievements={newAchievements} />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
