import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { memo, useEffect, useState } from "react";
import { BottomNavigation } from "@/components";
import { AchievementNotificationsContainer } from "@/components/achievements";
import { getNewlyUnlockedAchievements, type Achievement } from "@/lib/trophyService";
import { AlertMessagesContainer, useAlertMessage } from "@/components/ui";
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
  useEffect(() => {
    const checkForUnlockedAchievements = () => {
      const unlocked = getNewlyUnlockedAchievements();
      if (unlocked.length > 0) {
        const uniqueAchievements = unlocked.filter(
          a => !newAchievements.some(existing => existing.id === a.id)
        );
        if (uniqueAchievements.length > 0) {
          setNewAchievements(prev => [...prev, ...uniqueAchievements]);
        }
      }
    };
    const initialCheckTimer = setTimeout(() => {
      checkForUnlockedAchievements();
    }, 1000);
    const handleGameComplete = () => {
      checkForUnlockedAchievements();
    };
    window.addEventListener('gameComplete', handleGameComplete);
    return () => {
      window.removeEventListener('gameComplete', handleGameComplete);
      clearTimeout(initialCheckTimer);
    };
  }, [newAchievements]);
  useEffect(() => {
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
