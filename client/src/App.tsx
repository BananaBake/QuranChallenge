import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { memo } from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";

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
      <Header />
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
  return (
    <QueryClientProvider client={queryClient}>
      <div className="islamic-pattern min-h-screen bg-background text-textColor font-english relative">
        <div className="w-full relative min-h-screen pb-16">
          <AppRoutes />
          <Toaster />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
