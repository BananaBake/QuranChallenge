import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { LoadingSpinner, DraggableSurah } from "@/components/ui";
import { useGameState, useSurahOrderingData, useAchievementNotifications } from "@/hooks";
import { GameResult, GameControls, GameHeader, GameStatsBar } from "@/components";
export default function SurahOrdering() {
  var _useGameState = useGameState({
      gameMode: 'surah_ordering'
    }),
    score = _useGameState.score,
    gameEnded = _useGameState.gameEnded,
    previousHighScore = _useGameState.previousHighScore,
    isNewHighScore = _useGameState.isNewHighScore,
    formattedTime = _useGameState.formattedTime,
    incrementScore = _useGameState.incrementScore,
    endGame = _useGameState.endGame,
    checkHighScore = _useGameState.checkHighScore,
    resetGame = _useGameState.resetGame;
  var _useSurahOrderingData = useSurahOrderingData(),
    surahs = _useSurahOrderingData.surahs,
    isLoading = _useSurahOrderingData.isLoading,
    isLoadingNext = _useSurahOrderingData.isLoadingNext,
    initializeSurahs = _useSurahOrderingData.initializeSurahs,
    loadNextQuestion = _useSurahOrderingData.loadNextQuestion,
    handleMoveSurah = _useSurahOrderingData.handleMoveSurah,
    checkCorrectOrder = _useSurahOrderingData.checkCorrectOrder,
    originalSurahs = _useSurahOrderingData.originalSurahs;
  var _useAchievementNotifi = useAchievementNotifications(),
    checkProgress = _useAchievementNotifi.checkProgress;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    checked = _useState2[0],
    setChecked = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isCorrect = _useState4[0],
    setIsCorrect = _useState4[1];
  useEffect(function () {
    if (originalSurahs && originalSurahs.length > 0 && !gameEnded) {
      initializeSurahs(originalSurahs);
    }
  }, [originalSurahs, gameEnded, initializeSurahs]);
  var handleCheckOrder = useCallback(function () {
    setChecked(true);
    var orderCorrect = checkCorrectOrder();
    setIsCorrect(orderCorrect);
    if (orderCorrect) {
      incrementScore();
    } else {
      checkHighScore();
    }
  }, [checkCorrectOrder, incrementScore, checkHighScore]);
  var handleNext = useCallback(function () {
    if (gameEnded) return;
    setChecked(false);
    if (isCorrect) {
      loadNextQuestion();
      checkProgress();
    }
  }, [gameEnded, isCorrect, loadNextQuestion, checkProgress]);
  var handleStartNewGame = useCallback(function () {
    resetGame();
    setChecked(false);
    setIsCorrect(false);
    loadNextQuestion();
  }, [resetGame, loadNextQuestion]);
  if (isLoading) {
    return /*#__PURE__*/React.createElement(LoadingSpinner, {
      message: "Loading surahs..."
    });
  }
  if (gameEnded) {
    return /*#__PURE__*/React.createElement(GameResult, {
      score: score,
      formattedTime: formattedTime,
      isNewHighScore: isNewHighScore,
      onPlayAgain: handleStartNewGame,
      gameModeName: "round"
    });
  }
  var getFeedbackMessage = function getFeedbackMessage() {
    if (checked) {
      return isCorrect ? "✓ Correct! Your order is perfect." : "✗ Incorrect. The correct order is from lowest to highest surah number.";
    }
    return "Drag and drop the Surahs to arrange them in the correct Qur'anic order (from lowest to highest number)";
  };
  var getFeedbackClass = function getFeedbackClass() {
    if (!checked) return "bg-primary/10 text-primary";
    return isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-lg border border-gray-100 p-5 mb-6"
  }, /*#__PURE__*/React.createElement(GameHeader, {
    title: "Surah Ordering",
    subtitle: "Arrange the Surahs in correct order",
    score: score
  }), /*#__PURE__*/React.createElement("div", {
    className: "p-3 text-center mb-6 rounded-lg ".concat(getFeedbackClass())
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-medium"
  }, getFeedbackMessage())), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 mb-6"
  }, surahs.map(function (surah, index) {
    return /*#__PURE__*/React.createElement(DraggableSurah, {
      key: surah.number,
      name: surah.englishName,
      arabicName: surah.name,
      number: surah.number,
      index: index,
      onMoveItem: handleMoveSurah,
      showNumber: checked
    });
  })), isLoadingNext && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center p-4 mt-4 bg-primary/10 text-primary rounded-lg"
  }, /*#__PURE__*/React.createElement(Loader2, {
    className: "w-5 h-5 animate-spin mr-2"
  }), /*#__PURE__*/React.createElement("span", null, "Loading next challenge...")), /*#__PURE__*/React.createElement(GameControls, {
    checked: checked,
    isCorrect: isCorrect,
    gameEnded: gameEnded,
    isLoadingNext: isLoadingNext,
    onCheckOrder: handleCheckOrder,
    onSeeResults: endGame,
    onNext: handleNext
  })), /*#__PURE__*/React.createElement(GameStatsBar, {
    previousHighScore: previousHighScore,
    currentScore: score,
    formattedTime: formattedTime
  }));
}
