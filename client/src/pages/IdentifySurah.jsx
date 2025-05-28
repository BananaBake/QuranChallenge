import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { useState, useEffect } from "react";
import { useSurahs, useGameState, useIdentifySurahData, useAchievementNotifications } from "@/hooks";
import { Button, QuranText, SurahOption, LoadingSpinner } from "@/components/ui";
import { Loader2, AlertCircle } from "lucide-react";
import { GameResult, GameControls, GameHeader, GameStatsBar } from "@/components";
export default function IdentifySurah() {
  var _useSurahs = useSurahs(),
    allSurahs = _useSurahs.data,
    isLoadingSurahs = _useSurahs.isLoading;
  var _useGameState = useGameState({
      gameMode: 'identify_surah'
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
  var _useIdentifySurahData = useIdentifySurahData(),
    isLoading = _useIdentifySurahData.isLoading,
    currentAyah = _useIdentifySurahData.currentAyah,
    options = _useIdentifySurahData.options,
    isLoadingNext = _useIdentifySurahData.isLoadingNext,
    error = _useIdentifySurahData.error,
    setError = _useIdentifySurahData.setError,
    loadNextQuestion = _useIdentifySurahData.loadNextQuestion,
    initializeQuestion = _useIdentifySurahData.initializeQuestion;
  var _useAchievementNotifi = useAchievementNotifications(),
    checkProgress = _useAchievementNotifi.checkProgress;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    selectedOption = _useState2[0],
    setSelectedOption = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    revealAnswer = _useState4[0],
    setRevealAnswer = _useState4[1];
  useEffect(function () {
    if (allSurahs && allSurahs.length > 0 && currentAyah) {
      initializeQuestion(currentAyah, allSurahs);
    }
  }, [allSurahs, currentAyah, initializeQuestion]);
  useEffect(function () {
    if (allSurahs && allSurahs.length > 0 && !currentAyah && !gameEnded) {
      loadNextQuestion(allSurahs);
    }
  }, [allSurahs, currentAyah, gameEnded, loadNextQuestion]);
  var handleOptionSelect = function handleOptionSelect(index) {
    if (revealAnswer) return;
    setSelectedOption(index);
  };
  var handleConfirm = function handleConfirm() {
    if (selectedOption === null) {
      setError("You need to select a Surah before confirming");
      return;
    }
    setRevealAnswer(true);
    if (currentAyah && options[selectedOption].number === currentAyah.surah.number) {
      incrementScore();
    } else {
      checkHighScore();
    }
  };
  var handleNext = function handleNext() {
    if (gameEnded) return;
    setSelectedOption(null);
    setRevealAnswer(false);
    var isCorrectAnswer = currentAyah && selectedOption !== null && options[selectedOption].number === currentAyah.surah.number;
    if (isCorrectAnswer && allSurahs) {
      loadNextQuestion(allSurahs);
      checkProgress();
    }
  };
  var handleStartNewGame = function handleStartNewGame() {
    resetGame();
    setSelectedOption(null);
    setRevealAnswer(false);
    if (allSurahs) {
      loadNextQuestion(allSurahs);
    }
  };
  if (isLoading || isLoadingSurahs) {
    return /*#__PURE__*/React.createElement(LoadingSpinner, {
      message: "Loading questions..."
    });
  }
  if (gameEnded) {
    return /*#__PURE__*/React.createElement(GameResult, {
      score: score,
      formattedTime: formattedTime,
      isNewHighScore: isNewHighScore,
      onPlayAgain: handleStartNewGame,
      gameModeName: "Surah"
    });
  }
  var isCorrectAnswer = currentAyah && selectedOption !== null && options[selectedOption].number === currentAyah.surah.number;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-lg border border-gray-100 p-5 mb-4"
  }, /*#__PURE__*/React.createElement(GameHeader, {
    title: "Identify the Surah",
    subtitle: "Which Surah contains this Ayah?",
    score: score
  }), currentAyah && /*#__PURE__*/React.createElement(QuranText, {
    arabicText: currentAyah.text,
    ayahRef: currentAyah.ayahRef
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4 mb-4"
  }, options.map(function (option, index) {
    return /*#__PURE__*/React.createElement(SurahOption, {
      key: index,
      name: option.name,
      arabicName: option.arabicName,
      number: option.number,
      showNumber: revealAnswer,
      selected: selectedOption === index,
      correct: Boolean(revealAnswer && currentAyah && option.number === currentAyah.surah.number),
      incorrect: Boolean(revealAnswer && selectedOption === index && currentAyah && option.number !== currentAyah.surah.number),
      onClick: function onClick() {
        return handleOptionSelect(index);
      }
    });
  })), isLoadingNext && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center p-4 mt-4 bg-primary/10 text-primary rounded-lg"
  }, /*#__PURE__*/React.createElement(Loader2, {
    className: "w-5 h-5 animate-spin mr-2"
  }), /*#__PURE__*/React.createElement("span", null, "Loading next challenge...")), error && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center p-4 my-4 bg-destructive/10 text-destructive rounded-lg"
  }, /*#__PURE__*/React.createElement(AlertCircle, {
    className: "w-5 h-5 mr-2"
  }), /*#__PURE__*/React.createElement("span", null, error), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    className: "ml-auto",
    onClick: function onClick() {
      return setError(null);
    }
  }, "Dismiss")), /*#__PURE__*/React.createElement(GameControls, {
    revealAnswer: revealAnswer,
    selectedOption: selectedOption,
    isLoadingNext: isLoadingNext,
    isCorrectAnswer: Boolean(isCorrectAnswer),
    onConfirm: handleConfirm,
    onNext: handleNext,
    onEndGame: endGame
  })), /*#__PURE__*/React.createElement(GameStatsBar, {
    previousHighScore: previousHighScore,
    currentScore: score,
    formattedTime: formattedTime
  }));
}
