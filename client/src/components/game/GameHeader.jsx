import { Trophy, Clock } from "lucide-react";
export function GameHeader(_ref) {
  var title = _ref.title,
    subtitle = _ref.subtitle,
    score = _ref.score;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-5 flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mr-2"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold text-primary"
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 mt-1"
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    className: "bg-primary text-white rounded-full h-10 px-4 flex items-center justify-center font-bold whitespace-nowrap"
  }, "Score: ", score));
}
export function GameStatsBar(_ref2) {
  var previousHighScore = _ref2.previousHighScore,
    currentScore = _ref2.currentScore,
    formattedTime = _ref2.formattedTime;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(Trophy, {
    className: "w-4 h-4 text-secondary mr-1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "Best: ", Math.max(previousHighScore, currentScore))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(Clock, {
    className: "w-4 h-4 text-primary mr-1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "Time: ", formattedTime)));
}
