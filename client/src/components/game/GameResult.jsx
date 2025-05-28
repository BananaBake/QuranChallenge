import { Button } from "@/components/ui";
import { Trophy, Clock } from "lucide-react";
export function GameResult(_ref) {
  var score = _ref.score,
    formattedTime = _ref.formattedTime,
    isNewHighScore = _ref.isNewHighScore,
    onPlayAgain = _ref.onPlayAgain,
    _ref$gameModeName = _ref.gameModeName,
    gameModeName = _ref$gameModeName === void 0 ? "Surah" : _ref$gameModeName;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-md p-6 text-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold text-primary mb-2"
  }, isNewHighScore ? '🏆 New High Score!' : 'Great Effort!'), isNewHighScore ? /*#__PURE__*/React.createElement("p", {
    className: "text-accent font-bold mb-4"
  }, "Congratulations! You've beaten your previous best score!") : /*#__PURE__*/React.createElement("p", {
    className: "text-primary font-medium mb-4"
  }, "You did well! Each attempt helps you learn more about the Quran."), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 rounded-lg p-6 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(Trophy, {
    className: "w-5 h-5 text-secondary mr-2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-600"
  }, "Score:")), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xl text-primary"
  }, score)), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(Clock, {
    className: "w-5 h-5 text-primary mr-2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-600"
  }, "Time:")), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xl text-accent"
  }, formattedTime))), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 mb-6"
  }, "You correctly identified ", score, " ", score === 1 ? gameModeName : "".concat(gameModeName, "s"), ".", isNewHighScore && ' Keep going to improve your knowledge!'), /*#__PURE__*/React.createElement(Button, {
    className: "bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base shadow-md",
    onClick: onPlayAgain
  }, "Play Again"));
}
