import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useAchievements } from '@/hooks';
import { LoadingSpinner, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { TrophyCabinet, TrophyDetails, AchievementsList } from '@/components/achievements';
import { AnimatePresence, motion } from 'framer-motion';
import { PageContainer } from '@/components/common';
import { Award, Trophy, Medal } from 'lucide-react';
var EmptyState = /*#__PURE__*/memo(function (_ref) {
  var _ref$title = _ref.title,
    title = _ref$title === void 0 ? "Achievements" : _ref$title,
    _ref$message = _ref.message,
    message = _ref$message === void 0 ? "No achievements yet. Keep playing to unlock them!" : _ref$message;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-md p-6 text-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold text-primary mb-4"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "py-12 text-gray-500"
  }, /*#__PURE__*/React.createElement(Trophy, {
    className: "w-12 h-12 mx-auto mb-4 text-gray-300"
  }), /*#__PURE__*/React.createElement("p", null, message)));
});
EmptyState.displayName = "EmptyState";
var ProgressSummary = /*#__PURE__*/memo(function (_ref2) {
  var unlockedCount = _ref2.unlockedCount,
    totalCount = _ref2.totalCount,
    percentComplete = _ref2.percentComplete;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-primary/5 rounded-lg p-4 mb-6 flex items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4"
  }, /*#__PURE__*/React.createElement(Award, {
    className: "w-8 h-8 text-primary"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-primary"
  }, "Your Progress"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600"
  }, "You've unlocked ", unlockedCount, " of ", totalCount, " achievements (", percentComplete, "%)")));
});
ProgressSummary.displayName = "ProgressSummary";
var AchievementTabs = /*#__PURE__*/memo(function (_ref3) {
  var achievements = _ref3.achievements,
    selectedAchievement = _ref3.selectedAchievement,
    onSelectAchievement = _ref3.onSelectAchievement;
  return /*#__PURE__*/React.createElement(Tabs, {
    defaultValue: "trophies",
    className: "w-full"
  }, /*#__PURE__*/React.createElement(TabsList, {
    className: "grid w-full grid-cols-2 mb-6"
  }, /*#__PURE__*/React.createElement(TabsTrigger, {
    value: "trophies",
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(Trophy, {
    className: "w-4 h-4 mr-2"
  }), /*#__PURE__*/React.createElement("span", null, "Trophy Cabinet")), /*#__PURE__*/React.createElement(TabsTrigger, {
    value: "list",
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(Medal, {
    className: "w-4 h-4 mr-2"
  }), /*#__PURE__*/React.createElement("span", null, "Achievement List"))), /*#__PURE__*/React.createElement(TabsContent, {
    value: "trophies",
    className: "mt-0"
  }, /*#__PURE__*/React.createElement(TrophyCabinet, {
    achievements: achievements,
    onSelect: onSelectAchievement,
    selectedId: selectedAchievement === null || selectedAchievement === void 0 ? void 0 : selectedAchievement.id
  })), /*#__PURE__*/React.createElement(TabsContent, {
    value: "list",
    className: "mt-0"
  }, /*#__PURE__*/React.createElement(AchievementsList, {
    achievements: achievements
  })));
});
AchievementTabs.displayName = "AchievementTabs";
var AchievementModal = /*#__PURE__*/memo(function (_ref4) {
  var achievement = _ref4.achievement,
    onClose = _ref4.onClose;
  return /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0
    },
    className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-md w-full mx-auto",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement(TrophyDetails, {
    achievement: achievement,
    onClose: onClose
  })));
});
AchievementModal.displayName = "AchievementModal";
export default function Achievements() {
  var _useAchievements = useAchievements(),
    achievements = _useAchievements.data,
    isLoading = _useAchievements.isLoading,
    refetch = _useAchievements.refetch;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    selectedAchievement = _useState2[0],
    setSelectedAchievement = _useState2[1];
  var achievementStats = useMemo(function () {
    if (!achievements || achievements.length === 0) {
      return {
        unlockedCount: 0,
        totalCount: 0,
        percentComplete: 0
      };
    }
    var unlockedCount = achievements.filter(function (a) {
      return a.unlocked;
    }).length;
    var totalCount = achievements.length;
    var percentComplete = Math.round(unlockedCount / totalCount * 100);
    return {
      unlockedCount: unlockedCount,
      totalCount: totalCount,
      percentComplete: percentComplete
    };
  }, [achievements]);
  useEffect(function () {
    refetch();
  }, [refetch]);
  var handleSelectAchievement = useCallback(function (achievement) {
    setSelectedAchievement(achievement);
  }, []);
  var handleCloseDetails = useCallback(function () {
    setSelectedAchievement(null);
  }, []);
  if (isLoading) {
    return /*#__PURE__*/React.createElement(PageContainer, null, /*#__PURE__*/React.createElement(LoadingSpinner, {
      message: "Loading achievements..."
    }));
  }
  if (!achievements || achievements.length === 0) {
    return /*#__PURE__*/React.createElement(PageContainer, null, /*#__PURE__*/React.createElement(EmptyState, null));
  }
  return /*#__PURE__*/React.createElement(PageContainer, null, /*#__PURE__*/React.createElement("div", {
    className: "space-y-6 pb-12"
  }, /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      opacity: 0,
      y: -20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    className: "bg-white rounded-lg shadow-md p-6"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold text-primary mb-4"
  }, "Achievements"), /*#__PURE__*/React.createElement(ProgressSummary, achievementStats), /*#__PURE__*/React.createElement(AchievementTabs, {
    achievements: achievements,
    selectedAchievement: selectedAchievement,
    onSelectAchievement: handleSelectAchievement
  })), /*#__PURE__*/React.createElement(AnimatePresence, null, selectedAchievement && /*#__PURE__*/React.createElement(AchievementModal, {
    achievement: selectedAchievement,
    onClose: handleCloseDetails
  }))));
}
