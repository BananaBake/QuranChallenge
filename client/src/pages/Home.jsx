import { memo, useMemo } from "react";
import { PageContainer } from "@/components/common";
import { StatsCard } from "@/components/ui";
import { useRecentGames, useGameStats } from "@/hooks";
import { Search, ArrowUpDown, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
var HeroSection = /*#__PURE__*/memo(function (_ref) {
  var className = _ref.className;
  return /*#__PURE__*/React.createElement("div", {
    className: cn("relative overflow-hidden mb-8 rounded-lg bg-primary/5", className)
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 opacity-10 islamic-pattern",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative p-6 z-10"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold text-primary mb-3 text-center"
  }, "Quran Challenge"), /*#__PURE__*/React.createElement("p", {
    className: "mb-6 text-center text-gray-700"
  }, "Test your Quranic knowledge through endless challenges"), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-20 h-20 rounded-full border-2 border-secondary flex items-center justify-center bg-white shadow-md"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-arabic text-secondary text-3xl"
  }, "\u0642\u0631\u0622\u0646")))));
});
HeroSection.displayName = "HeroSection";
var StatsOverview = /*#__PURE__*/memo(function (_ref2) {
  var totalGames = _ref2.totalGames,
    bestStreak = _ref2.bestStreak,
    className = _ref2.className;
  return /*#__PURE__*/React.createElement("div", {
    className: cn("bg-white rounded-lg shadow-md p-4 mb-6", className)
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-bold text-primary mb-4 flex items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mr-2 text-secondary text-2xl"
  }, "\u2022"), " Your Statistics"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4 mb-6"
  }, /*#__PURE__*/React.createElement(StatsCard, {
    title: "Total Games",
    value: totalGames
  }), /*#__PURE__*/React.createElement(StatsCard, {
    title: "Best Streak",
    value: bestStreak
  })));
});
StatsOverview.displayName = "StatsOverview";
var GameMode = /*#__PURE__*/memo(function (_ref3) {
  var Icon = _ref3.icon,
    title = _ref3.title,
    description = _ref3.description;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-primary/10 p-2 rounded-md mr-3"
  }, /*#__PURE__*/React.createElement(Icon, {
    className: "w-5 h-5 text-primary"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600"
  }, description)));
});
GameMode.displayName = "GameMode";
var GameInstructions = /*#__PURE__*/memo(function (_ref4) {
  var className = _ref4.className;
  return /*#__PURE__*/React.createElement("div", {
    className: cn("bg-white rounded-lg shadow-md p-4 mb-6", className)
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-bold text-primary mb-4 flex items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mr-2 text-secondary text-2xl"
  }, "\u2022"), " How to Play"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-gray-50 rounded-lg mb-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-gray-700 mb-2"
  }, "Select a game mode from the bottom navigation:"), /*#__PURE__*/React.createElement(GameMode, {
    icon: Search,
    title: "Identify",
    description: "Identify which Surah contains a given Ayah"
  }), /*#__PURE__*/React.createElement(GameMode, {
    icon: ArrowUpDown,
    title: "Ordering",
    description: "Arrange Surahs in their correct sequential order"
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 px-2"
  }, "Both games are in endless mode - continue playing until you make a mistake. Try to achieve the highest possible streak!"));
});
GameInstructions.displayName = "GameInstructions";
var GameHistoryItem = /*#__PURE__*/memo(function (_ref5) {
  var game = _ref5.game,
    isNewHighScore = _ref5.isNewHighScore;
  var gameType = game.gameType === "identify_surah" ? "Identify Surah" : "Surah Ordering";
  var scoreText = "".concat(game.score || game.maxScore || 0);
  var timeText = "".concat(Math.floor(game.timeSpent / 60), ":").concat((game.timeSpent % 60).toString().padStart(2, '0'));
  var timeAgo = formatDistanceToNow(new Date(game.completedAt), {
    addSuffix: true
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 rounded-lg p-3 flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold"
  }, gameType), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, timeAgo)), /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-bold text-primary"
  }, scoreText), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Score")), /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-bold text-accent"
  }, timeText), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500"
  }, "Time")), isNewHighScore && /*#__PURE__*/React.createElement("div", {
    className: "text-center ml-2"
  }, /*#__PURE__*/React.createElement(Trophy, {
    className: "w-5 h-5 text-yellow-500"
  })));
});
GameHistoryItem.displayName = "GameHistoryItem";
var RecentActivity = /*#__PURE__*/memo(function (_ref6) {
  var games = _ref6.games,
    isLoading = _ref6.isLoading,
    stats = _ref6.stats,
    className = _ref6.className;
  return /*#__PURE__*/React.createElement("div", {
    className: cn("bg-white rounded-lg shadow-md p-4 mb-6", className)
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-bold text-primary mb-4 flex items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mr-2 text-secondary text-2xl"
  }, "\u2022"), " Recent Activity"), isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 rounded-lg p-4 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500"
  }, "Loading recent games...")) : games && Array.isArray(games) && games.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, games.map(function (game) {
    var _stats$modePerformanc;
    var isNewHighScore = game.score > ((stats === null || stats === void 0 || (_stats$modePerformanc = stats.modePerformance) === null || _stats$modePerformanc === void 0 ? void 0 : _stats$modePerformanc[game.gameType === "identify_surah" ? "identifySurah" : "surahOrdering"]) || 0) - 1;
    return /*#__PURE__*/React.createElement(GameHistoryItem, {
      key: game.id,
      game: game,
      isNewHighScore: isNewHighScore
    });
  })) : /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 rounded-lg p-4 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500"
  }, "No recent games found")));
});
RecentActivity.displayName = "RecentActivity";
export default function Home() {
  var _useRecentGames = useRecentGames(10),
    recentGames = _useRecentGames.data,
    isLoadingRecentGames = _useRecentGames.isLoading;
  var _useGameStats = useGameStats(),
    stats = _useGameStats.data,
    isLoadingStats = _useGameStats.isLoading;
  var _useMemo = useMemo(function () {
      if (!isLoadingStats && stats) {
        return {
          totalGames: stats.totalGames,
          bestStreak: stats.bestStreak
        };
      }
      return {
        totalGames: 0,
        bestStreak: 0
      };
    }, [isLoadingStats, stats]),
    totalGames = _useMemo.totalGames,
    bestStreak = _useMemo.bestStreak;
  return /*#__PURE__*/React.createElement(PageContainer, {
    className: "pb-4"
  }, /*#__PURE__*/React.createElement(HeroSection, null), !isLoadingStats && stats && /*#__PURE__*/React.createElement(StatsOverview, {
    totalGames: totalGames,
    bestStreak: bestStreak
  }), /*#__PURE__*/React.createElement(GameInstructions, null), /*#__PURE__*/React.createElement(RecentActivity, {
    games: recentGames,
    isLoading: isLoadingRecentGames,
    stats: stats
  }));
}
