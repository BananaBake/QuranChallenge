import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TrophyCabinet, TrophyDetails } from '@/components/achievements/TrophyCabinet';
import { AchievementsList } from '@/components/achievements/AchievementDisplay';
import { AnimatePresence, motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from '@/components/common/PageContainer';
import { Award, Trophy, Medal } from 'lucide-react';
import { Achievement } from '@/lib/trophyService';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

const EmptyState = memo(({ 
  title = "Achievements", 
  message = "No achievements yet. Keep playing to unlock them!" 
}: EmptyStateProps) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center">
    <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
    <div className="py-12 text-gray-500">
      <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>{message}</p>
    </div>
  </div>
));

EmptyState.displayName = "EmptyState";

interface ProgressSummaryProps {
  unlockedCount: number;
  totalCount: number;
  percentComplete: number;
}

const ProgressSummary = memo(({ unlockedCount, totalCount, percentComplete }: ProgressSummaryProps) => (
  <div className="bg-primary/5 rounded-lg p-4 mb-6 flex items-center">
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
));

ProgressSummary.displayName = "ProgressSummary";

interface AchievementTabsProps {
  achievements: Achievement[];
  selectedAchievement: Achievement | null;
  onSelectAchievement: (achievement: Achievement) => void;
}

const AchievementTabs = memo(({ 
  achievements, 
  selectedAchievement,
  onSelectAchievement 
}: AchievementTabsProps) => (
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
        onSelect={onSelectAchievement}
        selectedId={selectedAchievement?.id}
      />
    </TabsContent>
    
    <TabsContent value="list" className="mt-0">
      <AchievementsList achievements={achievements} />
    </TabsContent>
  </Tabs>
));

AchievementTabs.displayName = "AchievementTabs";

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementModal = memo(({ achievement, onClose }: AchievementModalProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    onClick={onClose}
  >
    <div 
      className="max-w-md w-full mx-auto" 
      onClick={e => e.stopPropagation()}
    >
      <TrophyDetails 
        achievement={achievement} 
        onClose={onClose}
      />
    </div>
  </motion.div>
));

AchievementModal.displayName = "AchievementModal";

export default function Achievements() {
  const { data: achievements, isLoading, refetch } = useAchievements();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  // Calculate achievement stats - moved before conditional rendering to fix hook order
  const achievementStats = useMemo(() => {
    if (!achievements || achievements.length === 0) {
      return { unlockedCount: 0, totalCount: 0, percentComplete: 0 };
    }
    
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;
    const percentComplete = Math.round((unlockedCount / totalCount) * 100);
    
    return { unlockedCount, totalCount, percentComplete };
  }, [achievements]);
  
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  const handleSelectAchievement = useCallback((achievement: Achievement) => {
    setSelectedAchievement(achievement);
  }, []);
  
  const handleCloseDetails = useCallback(() => {
    setSelectedAchievement(null);
  }, []);
  
  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner message="Loading achievements..." />
      </PageContainer>
    );
  }
  
  if (!achievements || achievements.length === 0) {
    return (
      <PageContainer>
        <EmptyState />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <div className="space-y-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-2xl font-bold text-primary mb-4">Achievements</h2>
          
          <ProgressSummary {...achievementStats} />
          
          <AchievementTabs 
            achievements={achievements} 
            selectedAchievement={selectedAchievement}
            onSelectAchievement={handleSelectAchievement}
          />
        </motion.div>
        
        <AnimatePresence>
          {selectedAchievement && (
            <AchievementModal 
              achievement={selectedAchievement}
              onClose={handleCloseDetails}
            />
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}