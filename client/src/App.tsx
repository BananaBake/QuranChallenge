import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import IdentifySurah from "@/pages/IdentifySurah";
import SurahOrdering from "@/pages/SurahOrdering";
import Statistics from "@/pages/Statistics";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";

function Router() {
  const [location] = useLocation();

  return (
    <>
      <Header />
      <main className="p-4 pb-20 w-full">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/identify-surah" component={IdentifySurah} />
          <Route path="/surah-ordering" component={SurahOrdering} />
          <Route path="/statistics" component={Statistics} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <BottomNavigation currentPath={location} />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="islamic-pattern min-h-screen bg-background text-textColor font-english relative">
        <div className="w-full relative min-h-screen pb-16">
          <Router />
          <Toaster />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
