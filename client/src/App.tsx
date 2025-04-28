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
    // Initial check on mount
    const checkForUnlockedAchievements = () => {
      const unlocked = getNewlyUnlockedAchievements();
      if (unlocked.length > 0) {
        setNewAchievements(unlocked);
      }
    };
    
    // Check once on mount
    checkForUnlockedAchievements();
    
    // Create a custom event handler for game completion
    const handleGameComplete = () => {
      setTimeout(() => {
        checkForUnlockedAchievements();
      }, 500); // Small delay to allow achievements to be processed
    };
    
    // Register event
    window.addEventListener('gameComplete', handleGameComplete);
    
    return () => {
      window.removeEventListener('gameComplete', handleGameComplete);
    };
  }, []);
  
  // Clear achievements after they've been shown
  useEffect(() => {
    if (newAchievements.length > 0) {
      // Reset after a delay to ensure component has processed them
      const timer = setTimeout(() => {
        setNewAchievements([]);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [newAchievements]);
  
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
