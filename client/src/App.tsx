import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Suspense, lazy, memo } from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";

// Lazy load page components for better performance
const Home = lazy(() => import("@/pages/Home"));
const IdentifySurah = lazy(() => import("@/pages/IdentifySurah"));
const SurahOrdering = lazy(() => import("@/pages/SurahOrdering"));
const Achievements = lazy(() => import("@/pages/Achievements"));
const NotFound = lazy(() => import("@/pages/not-found"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="animate-pulse flex flex-col items-center">
      <div className="rounded-full bg-primary/30 h-12 w-12 mb-4"></div>
      <div className="h-4 bg-primary/20 rounded w-24 mb-2.5"></div>
      <div className="h-2 bg-primary/20 rounded w-32"></div>
    </div>
  </div>
);

const AppRoutes = memo(() => {
  const [location] = useLocation();

  return (
    <>
      <Header />
      <main className="p-4 pb-20 w-full">
        <Suspense fallback={<LoadingFallback />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/identify-surah" component={IdentifySurah} />
            <Route path="/surah-ordering" component={SurahOrdering} />
            <Route path="/achievements" component={Achievements} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
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
