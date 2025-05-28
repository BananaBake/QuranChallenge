import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import React, { useEffect, useState, useCallback } from 'react';
import { clearNewlyUnlockedIds } from "@/lib/trophyService";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui";
import { AnimatePresence, motion } from "framer-motion";
export function AchievementItem(_ref) {
  var achievement = _ref.achievement;
  return /*#__PURE__*/React.createElement("div", {
    className: cn("p-4 rounded-lg border flex items-center gap-3", achievement.unlocked ? "bg-primary/10 border-primary/30" : "bg-gray-100 border-gray-200")
  }, /*#__PURE__*/React.createElement("div", {
    className: cn("w-12 h-12 rounded-full flex items-center justify-center text-xl", achievement.unlocked ? "bg-primary/20" : "bg-gray-200")
  }, achievement.icon), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("h4", {
    className: cn("font-bold", achievement.unlocked ? "text-primary" : "text-gray-500")
  }, achievement.title), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600"
  }, achievement.description), achievement.goal && achievement.progress !== undefined && !achievement.unlocked && /*#__PURE__*/React.createElement("div", {
    className: "mt-1"
  }, /*#__PURE__*/React.createElement(Progress, {
    value: achievement.progress / achievement.goal * 100,
    className: "h-2 bg-gray-200"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-500"
  }, achievement.progress, " / ", achievement.goal))), achievement.unlocked && /*#__PURE__*/React.createElement("div", {
    className: "text-2xl"
  }, "\u2713"));
}
export function AchievementsList(_ref2) {
  var achievements = _ref2.achievements;
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, achievements.map(function (achievement) {
    return /*#__PURE__*/React.createElement(AchievementItem, {
      key: achievement.id,
      achievement: achievement
    });
  }));
}
export function AchievementNotification(_ref3) {
  var achievement = _ref3.achievement,
    onClose = _ref3.onClose;
  useEffect(function () {
    var timer = setTimeout(function () {
      onClose();
    }, 4000);
    return function () {
      clearTimeout(timer);
    };
  }, [onClose]);
  return /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.8
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.8
    },
    transition: {
      duration: 0.3
    },
    className: "fixed bottom-16 right-4 bg-white rounded-lg shadow-lg p-4 border-l-4 border-primary z-50 w-80"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start relative pr-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3 flex-shrink-0"
  }, achievement.icon), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-primary"
  }, "Achievement Unlocked!"), /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, achievement.title), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600"
  }, achievement.description)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "absolute top-0 right-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1",
    "aria-label": "Close notification"
  }, "\u2715")));
}
export function AchievementNotificationsContainer(_ref4) {
  var achievements = _ref4.achievements;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    currentAchievement = _useState2[0],
    setCurrentAchievement = _useState2[1];
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    queue = _useState4[0],
    setQueue = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    processingQueue = _useState6[0],
    setProcessingQueue = _useState6[1];
  var _useState7 = useState(new Set()),
    _useState8 = _slicedToArray(_useState7, 2),
    processedIds = _useState8[0],
    setProcessedIds = _useState8[1];
  useEffect(function () {
    if (achievements.length > 0) {
      var uniqueAchievements = achievements.filter(function (a) {
        return !processedIds.has(a.id);
      });
      if (uniqueAchievements.length > 0) {
        setQueue(function (prev) {
          var newQueue = [].concat(_toConsumableArray(prev), _toConsumableArray(uniqueAchievements));
          return newQueue;
        });
        setProcessedIds(function (prev) {
          var newProcessedIds = new Set(prev);
          uniqueAchievements.forEach(function (a) {
            return newProcessedIds.add(a.id);
          });
          return newProcessedIds;
        });
      }
    }
  }, [achievements, processedIds]);
  useEffect(function () {
    if (queue.length > 0 && !currentAchievement && !processingQueue) {
      setProcessingQueue(true);
      setTimeout(function () {
        setCurrentAchievement(queue[0]);
        setQueue(function (prev) {
          return prev.slice(1);
        });
        setProcessingQueue(false);
      }, 300);
    }
  }, [queue, currentAchievement, processingQueue]);
  useEffect(function () {
    if (queue.length === 0 && !currentAchievement && !processingQueue) {
      clearNewlyUnlockedIds();
    }
  }, [queue, currentAchievement, processingQueue]);
  useEffect(function () {
    var initializeAchievements = /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var _yield$import, checkAchievementsProgress, newAchievements;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return import('@/lib/trophyService');
            case 2:
              _yield$import = _context.sent;
              checkAchievementsProgress = _yield$import.checkAchievementsProgress;
              newAchievements = checkAchievementsProgress();
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function initializeAchievements() {
        return _ref5.apply(this, arguments);
      };
    }();
    initializeAchievements();
    clearNewlyUnlockedIds();
  }, []);
  var handleClose = useCallback(function () {
    if (currentAchievement) {}
    setCurrentAchievement(null);
  }, [currentAchievement]);
  return /*#__PURE__*/React.createElement(AnimatePresence, {
    mode: "wait"
  }, currentAchievement && /*#__PURE__*/React.createElement(AchievementNotification, {
    key: currentAchievement.id,
    achievement: currentAchievement,
    onClose: handleClose
  }));
}
