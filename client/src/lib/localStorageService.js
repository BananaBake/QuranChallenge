import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
import { updateAchievements } from './trophyService';
var GAME_HISTORY_KEY = 'quran_challenge_history';
var initialStats = {
  totalGames: 0,
  averageScore: 0,
  bestStreak: 0,
  ayatLearned: 0,
  modePerformance: {
    identifySurah: 0,
    surahOrdering: 0
  },
  highScoreBeatenCount: 0,
  recentGames: []
};
export function getGameHistory() {
  var historyString = localStorage.getItem(GAME_HISTORY_KEY);
  if (!historyString) {
    return [];
  }
  try {
    return JSON.parse(historyString);
  } catch (error) {
    localStorage.removeItem(GAME_HISTORY_KEY);
    return [];
  }
}
export function saveGameHistory(game) {
  var history = getGameHistory();
  var newGame = _objectSpread(_objectSpread({}, game), {}, {
    id: Date.now(),
    completedAt: new Date()
  });
  var updatedHistory = [newGame].concat(_toConsumableArray(history));
  var limitedHistory = updatedHistory.slice(0, 50);
  localStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(limitedHistory));
  updateAchievements(newGame);
  return newGame;
}
export function getRecentGameHistory() {
  var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
  var history = getGameHistory();
  return history.slice(0, limit);
}
export function getGameStats() {
  var history = getGameHistory();
  if (history.length === 0) {
    return initialStats;
  }
  var totalGames = history.length;
  var scores = history.map(function (game) {
    return game.score;
  });
  var averageScore = scores.reduce(function (a, b) {
    return a + b;
  }, 0) / totalGames;
  var identifySurahBest = 0;
  var surahOrderingBest = 0;
  history.forEach(function (game) {
    if (game.gameType === 'identify_surah') {
      identifySurahBest = Math.max(identifySurahBest, game.score);
    } else if (game.gameType === 'surah_ordering') {
      surahOrderingBest = Math.max(surahOrderingBest, game.score);
    }
  });
  var bestStreak = Math.max(identifySurahBest, surahOrderingBest);
  var ayatLearned = totalGames + Math.floor(bestStreak / 2);
  var highScoreBeatenCount = parseInt(localStorage.getItem('quran_challenge_highscore_beats') || '0');
  return {
    totalGames: totalGames,
    averageScore: averageScore,
    bestStreak: bestStreak,
    ayatLearned: ayatLearned,
    modePerformance: {
      identifySurah: identifySurahBest,
      surahOrdering: surahOrderingBest
    },
    highScoreBeatenCount: highScoreBeatenCount,
    recentGames: getRecentGameHistory()
  };
}
export function incrementHighScoreBeatenCount() {
  var HIGH_SCORE_BEATS_KEY = 'quran_challenge_highscore_beats';
  var currentCount = parseInt(localStorage.getItem(HIGH_SCORE_BEATS_KEY) || '0');
  var newCount = currentCount + 1;
  localStorage.setItem(HIGH_SCORE_BEATS_KEY, newCount.toString());
  return newCount;
}
