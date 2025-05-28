import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { useState, useEffect, useCallback } from 'react';
import { useSaveGameResult, useGameStats } from './useGameStats';
import { useAchievementNotifications } from './useAchievements';
import { useGameTimer } from './useGameTimer';
export function useGameState(_ref) {
  var gameMode = _ref.gameMode,
    _ref$initialScore = _ref.initialScore,
    initialScore = _ref$initialScore === void 0 ? 0 : _ref$initialScore;
  var _useState = useState(initialScore),
    _useState2 = _slicedToArray(_useState, 2),
    score = _useState2[0],
    setScore = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    gameEnded = _useState4[0],
    setGameEnded = _useState4[1];
  var _useState5 = useState(0),
    _useState6 = _slicedToArray(_useState5, 2),
    previousHighScore = _useState6[0],
    setPreviousHighScore = _useState6[1];
  var _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    isNewHighScore = _useState8[0],
    setIsNewHighScore = _useState8[1];
  var _useGameStats = useGameStats(),
    stats = _useGameStats.data;
  var _useSaveGameResult = useSaveGameResult(),
    saveGameResult = _useSaveGameResult.mutate;
  var _useGameTimer = useGameTimer(!gameEnded),
    timeSpent = _useGameTimer.timeSpent,
    formattedTime = _useGameTimer.formattedTime,
    resetTimer = _useGameTimer.resetTimer;
  var _useAchievementNotifi = useAchievementNotifications(),
    handleHighScoreAchievements = _useAchievementNotifi.handleHighScoreAchievements,
    updateStreakAchievements = _useAchievementNotifi.updateStreakAchievements,
    checkProgress = _useAchievementNotifi.checkProgress;
  useEffect(function () {
    if (stats !== null && stats !== void 0 && stats.modePerformance) {
      var highScore = gameMode === 'identify_surah' ? stats.modePerformance.identifySurah : stats.modePerformance.surahOrdering;
      setPreviousHighScore(highScore || 0);
    }
  }, [stats, gameMode]);
  var incrementScore = useCallback(function () {
    setScore(function (prevScore) {
      var newScore = prevScore + 1;
      updateStreakAchievements(gameMode, newScore);
      window.dispatchEvent(new Event('gameComplete'));
      return newScore;
    });
  }, [gameMode, updateStreakAchievements]);
  var endGame = useCallback(function () {
    saveGameResult({
      userId: 1,
      gameType: gameMode,
      score: score,
      maxScore: score,
      timeSpent: timeSpent
    });
    checkProgress();
    setGameEnded(true);
    setTimeout(function () {
      window.dispatchEvent(new Event('gameComplete'));
    }, 300);
  }, [gameMode, score, timeSpent, saveGameResult, checkProgress]);
  var checkHighScore = useCallback(function () {
    var currentScore = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : score;
    if (currentScore > previousHighScore) {
      setIsNewHighScore(true);
      handleHighScoreAchievements(currentScore, previousHighScore);
      setTimeout(function () {
        window.dispatchEvent(new Event('gameComplete'));
      }, 200);
      return true;
    }
    return false;
  }, [score, previousHighScore, handleHighScoreAchievements]);
  var resetGame = useCallback(function () {
    setScore(initialScore);
    setGameEnded(false);
    setIsNewHighScore(false);
    resetTimer();
  }, [initialScore, resetTimer]);
  return {
    score: score,
    gameEnded: gameEnded,
    previousHighScore: previousHighScore,
    isNewHighScore: isNewHighScore,
    timeSpent: timeSpent,
    formattedTime: formattedTime,
    incrementScore: incrementScore,
    endGame: endGame,
    checkHighScore: checkHighScore,
    resetGame: resetGame
  };
}
