import React, { useEffect, useState, useCallback } from 'react';
import { type Achievement, clearNewlyUnlockedIds } from "@/lib/trophyService";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui";
import { AnimatePresence, motion } from "framer-motion";

interface AchievementItemProps {
  achievement: Achievement;
}

export function AchievementItem({ achievement }: AchievementItemProps) {
  return (
    <div 
      className={cn(
        "p-4 rounded-lg border flex items-center gap-3",
        achievement.unlocked 
          ? "bg-primary/10 border-primary/30" 
          : "bg-gray-100 border-gray-200"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center text-xl",
        achievement.unlocked ? "bg-primary/20" : "bg-gray-200"
      )}>
        {achievement.icon}
      </div>
      
      <div className="flex-1">
        <h4 className={cn(
          "font-bold",
          achievement.unlocked ? "text-primary" : "text-gray-500"
        )}>
          {achievement.title}
        </h4>
        <p className="text-sm text-gray-600">{achievement.description}</p>
        
        {achievement.goal && (achievement.progress !== undefined) && !achievement.unlocked && (
          <div className="mt-1">
            <Progress 
              value={(achievement.progress / achievement.goal) * 100} 
              className="h-2 bg-gray-200"
            />
            <span className="text-xs text-gray-500">
              {achievement.progress} / {achievement.goal}
            </span>
          </div>
        )}
      </div>
      
      {achievement.unlocked && (
        <div className="text-2xl">✓</div>
      )}
    </div>
  );
}

interface AchievementsListProps {
  achievements: Achievement[];
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  return (
    <div className="space-y-3">
      {achievements.map(achievement => (
        <AchievementItem key={achievement.id} achievement={achievement} />
      ))}
    </div>
  );
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-16 right-4 bg-white rounded-lg shadow-lg p-4 border-l-4 border-primary z-50 max-w-sm"
    >
      <div className="flex items-center">
        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3">
          {achievement.icon}
        </div>
        <div>
          <h4 className="font-bold text-primary">Achievement Unlocked!</h4>
          <p className="font-semibold">{achievement.title}</p>
          <p className="text-sm text-gray-600">{achievement.description}</p>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}

interface AchievementNotificationsContainerProps {
  achievements: Achievement[];
}

export function AchievementNotificationsContainer({ achievements }: AchievementNotificationsContainerProps) {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [queue, setQueue] = useState<Achievement[]>([]);
  const [processingQueue, setProcessingQueue] = useState(false);
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    if (achievements.length > 0) {
      const uniqueAchievements = achievements.filter(a => !processedIds.has(a.id));
      
      if (uniqueAchievements.length > 0) {
        setQueue(prev => {
          const newQueue = [...prev, ...uniqueAchievements];
          return newQueue;
        });
        
        setProcessedIds(prev => {
          const newProcessedIds = new Set(prev);
          uniqueAchievements.forEach(a => newProcessedIds.add(a.id));
          return newProcessedIds;
        });
      }
    }
  }, [achievements, processedIds]);
  
  useEffect(() => {
    if (queue.length > 0 && !currentAchievement && !processingQueue) {
      setProcessingQueue(true);
      setTimeout(() => {
        setCurrentAchievement(queue[0]);
        setQueue(prev => prev.slice(1));
        setProcessingQueue(false);
      }, 300); // Small delay to ensure animations work properly
    }
  }, [queue, currentAchievement, processingQueue]);
  
  useEffect(() => {
    if (queue.length === 0 && !currentAchievement && !processingQueue) {
      clearNewlyUnlockedIds();
    }
  }, [queue, currentAchievement, processingQueue]);
  
  useEffect(() => {
    const initializeAchievements = async () => {
      const { checkAchievementsProgress } = await import('@/lib/trophyService');
      const newAchievements = checkAchievementsProgress();
      
    };
    
    initializeAchievements();
    
    clearNewlyUnlockedIds();
  }, []);
  
  const handleClose = useCallback(() => {
    if (currentAchievement) {
    }
    setCurrentAchievement(null);
  }, [currentAchievement]);
  
  return (
    <AnimatePresence mode="wait">
      {currentAchievement && (
        <AchievementNotification 
          key={currentAchievement.id}
          achievement={currentAchievement} 
          onClose={handleClose} 
        />
      )}
    </AnimatePresence>
  );
}