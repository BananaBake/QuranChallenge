import React, { useEffect, useState, useCallback } from 'react';
import { type Achievement, clearNewlyUnlockedIds } from "@/lib/trophyService";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
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
        
        {achievement.goal && (achievement.progress !== undefined) && (
          <div className="mt-1">
            <Progress 
              value={(achievement.progress / achievement.goal) * 100} 
              className={cn(
                "h-2",
                achievement.unlocked ? "bg-green-200" : "bg-gray-200"
              )}
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
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border-l-4 border-secondary z-50 max-w-sm"
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
  
  // Process incoming achievements
  useEffect(() => {
    if (achievements.length > 0) {
      setQueue(prev => [...prev, ...achievements]);
    }
  }, [achievements]);
  
  // Handle showing the next achievement from the queue
  useEffect(() => {
    if (queue.length > 0 && !currentAchievement) {
      // Show the next one
      setCurrentAchievement(queue[0]);
      setQueue(prev => prev.slice(1));
    }
  }, [queue, currentAchievement]);
  
  // When all notifications are done, clear the newly unlocked storage
  useEffect(() => {
    if (queue.length === 0 && !currentAchievement) {
      clearNewlyUnlockedIds();
    }
  }, [queue, currentAchievement]);
  
  const handleClose = useCallback(() => {
    setCurrentAchievement(null);
  }, []);
  
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