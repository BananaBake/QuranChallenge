import React from 'react';
import { type Achievement } from "@/lib/trophyService";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TrophyProps {
  achievement: Achievement;
  highlighted?: boolean;
}

export function Trophy({ achievement, highlighted = false }: TrophyProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -5 }}
      className={cn(
        "relative w-20 h-24 flex flex-col items-center justify-center rounded-lg p-2",
        achievement.unlocked 
          ? "bg-secondary/20 border border-secondary/30" 
          : "bg-gray-100 border border-gray-200 opacity-50",
        highlighted && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <div className={cn(
        "text-3xl mb-1",
        !achievement.unlocked && "grayscale"
      )}>
        {achievement.icon}
      </div>
      <div className="text-center">
        <p className={cn(
          "text-xs font-bold",
          achievement.unlocked ? "text-primary" : "text-gray-500"
        )}>
          {achievement.title}
        </p>
      </div>
      
      {achievement.goal && achievement.progress !== undefined && !achievement.unlocked && (
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold">
          {Math.min(99, Math.floor((achievement.progress / achievement.goal) * 100))}%
        </div>
      )}
    </motion.div>
  );
}

interface TrophyCabinetProps {
  achievements: Achievement[];
  onSelect?: (achievement: Achievement) => void;
  selectedId?: string;
}

export function TrophyCabinet({ achievements, onSelect, selectedId }: TrophyCabinetProps) {
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    if (a.progress && b.progress) {
      return (b.progress / (b.goal || 1)) - (a.progress / (a.goal || 1));
    }
    return 0;
  });
  
  return (
    <motion.div 
      className="p-4 bg-gray-50 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
        <span className="mr-2 text-secondary text-2xl">•</span> Trophy Cabinet
      </h3>
      
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {sortedAchievements.map(achievement => (
          <div key={achievement.id} onClick={() => onSelect?.(achievement)}>
            <Trophy 
              achievement={achievement} 
              highlighted={selectedId === achievement.id}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface TrophyDetailsProps {
  achievement: Achievement;
  onClose: () => void;
}

export function TrophyDetails({ achievement, onClose }: TrophyDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
    >
      <div className="flex items-center mb-4">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-4",
          achievement.unlocked ? "bg-secondary/20" : "bg-gray-100"
        )}>
          {achievement.icon}
        </div>
        
        <div>
          <h3 className={cn(
            "text-xl font-bold",
            achievement.unlocked ? "text-primary" : "text-gray-500"
          )}>
            {achievement.title}
          </h3>
          <p className="text-gray-600">{achievement.description}</p>
          
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-gray-500 mt-1">
              Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      {achievement.goal && achievement.progress !== undefined && !achievement.unlocked && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{achievement.progress} / {achievement.goal}</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary"
              style={{ width: `${Math.min(100, (achievement.progress / achievement.goal) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}