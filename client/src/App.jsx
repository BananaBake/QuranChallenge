import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { memo, useEffect, useState } from "react";
import { BottomNavigation } from "@/components";
import { AchievementNotificationsContainer } from "@/components/achievements";
import { getNewlyUnlockedAchievements } from "@/lib/trophyService";
import { AlertMessagesContainer, useAlertMessage } from "@/components/ui";
import Home from "@/pages/Home";
import IdentifySurah from "@/pages/IdentifySurah";
import SurahOrdering from "@/pages/SurahOrdering";
import Achievements from "@/pages/Achievements";
import NotFound from "@/pages/not-found";
var AppRoutes = /*#__PURE__*/memo(function () {
  var _useLocation = useLocation(),
    _useLocation2 = _slicedToArray(_useLocation, 1),
    location = _useLocation2[0];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("main", {
    className: "p-4 pb-20 w-full"
  }, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: "/",
    component: Home
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/identify-surah",
    component: IdentifySurah
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/surah-ordering",
    component: SurahOrdering
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/achievements",
    component: Achievements
  }), /*#__PURE__*/React.createElement(Route, {
    component: NotFound
  }))), /*#__PURE__*/React.createElement(BottomNavigation, {
    currentPath: location
  }));
});
AppRoutes.displayName = "AppRoutes";
function App() {
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    newAchievements = _useState2[0],
    setNewAchievements = _useState2[1];
  var _useAlertMessage = useAlertMessage(),
    messages = _useAlertMessage.messages,
    showMessage = _useAlertMessage.showMessage,
    dismissMessage = _useAlertMessage.dismissMessage;
  useEffect(function () {
    var checkForUnlockedAchievements = function checkForUnlockedAchievements() {
      var unlocked = getNewlyUnlockedAchievements();
      if (unlocked.length > 0) {
        var uniqueAchievements = unlocked.filter(function (a) {
          return !newAchievements.some(function (existing) {
            return existing.id === a.id;
          });
        });
        if (uniqueAchievements.length > 0) {
          setNewAchievements(function (prev) {
            return [].concat(_toConsumableArray(prev), _toConsumableArray(uniqueAchievements));
          });
        }
      }
    };
    var initialCheckTimer = setTimeout(function () {
      checkForUnlockedAchievements();
    }, 1000);
    var handleGameComplete = function handleGameComplete() {
      checkForUnlockedAchievements();
    };
    window.addEventListener('gameComplete', handleGameComplete);
    return function () {
      window.removeEventListener('gameComplete', handleGameComplete);
      clearTimeout(initialCheckTimer);
    };
  }, [newAchievements]);
  useEffect(function () {
    window.showAlertMessage = showMessage;
    return function () {
      delete window.showAlertMessage;
    };
  }, [showMessage]);
  return /*#__PURE__*/React.createElement(QueryClientProvider, {
    client: queryClient
  }, /*#__PURE__*/React.createElement("div", {
    className: "islamic-pattern min-h-screen bg-background text-textColor font-english relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full relative min-h-screen pb-16"
  }, /*#__PURE__*/React.createElement(AppRoutes, null), /*#__PURE__*/React.createElement(AlertMessagesContainer, {
    messages: messages,
    onDismiss: dismissMessage
  }), /*#__PURE__*/React.createElement(AchievementNotificationsContainer, {
    achievements: newAchievements
  }))));
}
export default App;
