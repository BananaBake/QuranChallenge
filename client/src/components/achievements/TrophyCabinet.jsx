import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
export function Trophy(_ref) {
  var achievement = _ref.achievement,
    _ref$highlighted = _ref.highlighted,
    highlighted = _ref$highlighted === void 0 ? false : _ref$highlighted;
  return /*#__PURE__*/React.createElement(motion.div, {
    whileHover: {
      scale: 1.1,
      y: -5
    },
    className: cn("relative w-20 h-24 flex flex-col items-center justify-center rounded-lg p-2", achievement.unlocked ? "bg-secondary/20 border border-secondary/30" : "bg-gray-100 border border-gray-200 opacity-50", highlighted && "ring-2 ring-primary ring-offset-2")
  }, /*#__PURE__*/React.createElement("div", {
    className: cn("text-3xl mb-1", !achievement.unlocked && "grayscale")
  }, achievement.icon), /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: cn("text-xs font-bold", achievement.unlocked ? "text-primary" : "text-gray-500")
  }, achievement.title)), achievement.goal && achievement.progress !== undefined && !achievement.unlocked && /*#__PURE__*/React.createElement("div", {
    className: "absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold"
  }, Math.min(99, Math.floor(achievement.progress / achievement.goal * 100)), "%"));
}
export function TrophyCabinet(_ref2) {
  var achievements = _ref2.achievements,
    onSelect = _ref2.onSelect,
    selectedId = _ref2.selectedId;
  var sortedAchievements = _toConsumableArray(achievements).sort(function (a, b) {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    if (a.progress && b.progress) {
      return b.progress / (b.goal || 1) - a.progress / (a.goal || 1);
    }
    return 0;
  });
  return /*#__PURE__*/React.createElement(motion.div, {
    className: "p-4 bg-gray-50 rounded-lg",
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-bold text-primary mb-4 flex items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mr-2 text-secondary text-2xl"
  }, "\u2022"), " Trophy Cabinet"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
  }, sortedAchievements.map(function (achievement) {
    return /*#__PURE__*/React.createElement("div", {
      key: achievement.id,
      onClick: function onClick() {
        return onSelect === null || onSelect === void 0 ? void 0 : onSelect(achievement);
      }
    }, /*#__PURE__*/React.createElement(Trophy, {
      achievement: achievement,
      highlighted: selectedId === achievement.id
    }));
  })));
}
export function TrophyDetails(_ref3) {
  var achievement = _ref3.achievement,
    onClose = _ref3.onClose;
  return /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      opacity: 0,
      scale: 0.8
    },
    animate: {
      opacity: 1,
      scale: 1
    },
    exit: {
      opacity: 0,
      scale: 0.8
    },
    className: "bg-white rounded-lg shadow-md p-6 border border-gray-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: cn("w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-4", achievement.unlocked ? "bg-secondary/20" : "bg-gray-100")
  }, achievement.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: cn("text-xl font-bold", achievement.unlocked ? "text-primary" : "text-gray-500")
  }, achievement.title), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600"
  }, achievement.description), achievement.unlocked && achievement.unlockedAt && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mt-1"
  }, "Unlocked on ", new Date(achievement.unlockedAt).toLocaleDateString()))), achievement.goal && achievement.progress !== undefined && !achievement.unlocked && /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 p-3 rounded-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-sm mb-1"
  }, /*#__PURE__*/React.createElement("span", null, "Progress"), /*#__PURE__*/React.createElement("span", null, achievement.progress, " / ", achievement.goal)), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 bg-gray-200 rounded-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-primary",
    style: {
      width: "".concat(Math.min(100, achievement.progress / achievement.goal * 100), "%")
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 flex justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800"
  }, "Close")));
}
