import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAchievements } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TrophyCabinet, TrophyDetails } from '@/components/ui/trophy-cabinet';
import { AchievementsList } from '@/components/ui/achievement-display';
import { AnimatePresence, motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Award, Trophy, Medal, RefreshCw } from 'lucide-react';
import { Achievement } from '@/lib/localStorageService';

export default function Achievements() {
  const { data: achievements, isLoading, refresh } = useAchievements();
  const { toast } = useToast();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Force a refresh of the achievement data when the page loads
  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);
  
  if (isLoading) {
    return <LoadingSpinner message="Loading achievements..." />;
  }
  
  if (!achievements || achievements.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Achievements</h2>
        <div className="py-12 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No achievements yet. Keep playing to unlock them!</p>
        </div>
      </div>
    );
  }
  
  // Count unlocked achievements
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const percentComplete = Math.round((unlockedCount / totalCount) * 100);
  
  // Handle closing the achievement details modal
  const handleCloseDetails = () => {
    setSelectedAchievement(null);
  };
  
  return (
    <div className="space-y-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-bold text-primary mb-4">Achievements</h2>
        
        <div className="bg-primary/5 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary">Your Progress</h3>
              <p className="text-gray-600">
                You've unlocked {unlockedCount} of {totalCount} achievements ({percentComplete}%)
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1" 
            onClick={() => {
              // Reset the achievements in local storage
              localStorage.removeItem('quran_challenge_achievements');
              localStorage.setItem('quran_challenge_highscore_beats', '0');
              
              // Force a refresh of the achievements
              setRefreshKey(prev => prev + 1);
              
              // Show a notification to the user
              toast({
                title: "Achievements Reset",
                description: "Your trophies have been reset to show all possible achievements.",
                variant: "default",
              });
            }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </Button>
        </div>
        
        <Tabs defaultValue="trophies" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="trophies" className="flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              <span>Trophy Cabinet</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center">
              <Medal className="w-4 h-4 mr-2" />
              <span>Achievement List</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trophies" className="mt-0">
            <TrophyCabinet 
              achievements={achievements} 
              onSelect={setSelectedAchievement}
              selectedId={selectedAchievement?.id}
            />
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <AchievementsList achievements={achievements} />
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Achievement details modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseDetails}
          >
            <div 
              className="max-w-md w-full mx-auto" 
              onClick={e => e.stopPropagation()}
            >
              <TrophyDetails 
                achievement={selectedAchievement} 
                onClose={handleCloseDetails}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}