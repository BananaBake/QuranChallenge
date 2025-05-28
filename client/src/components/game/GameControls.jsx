import { Button } from "../ui";
import { Check, Loader2 } from "lucide-react";
function LoadingButton(_ref) {
  var isLoading = _ref.isLoading,
    _ref$loadingText = _ref.loadingText,
    loadingText = _ref$loadingText === void 0 ? "Loading..." : _ref$loadingText,
    children = _ref.children,
    _ref$onClick = _ref.onClick,
    onClick = _ref$onClick === void 0 ? function () {} : _ref$onClick,
    disabled = _ref.disabled,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? "bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base shadow-md" : _ref$className;
  return /*#__PURE__*/React.createElement(Button, {
    className: className,
    onClick: onClick,
    disabled: disabled || isLoading
  }, isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement(Loader2, {
    className: "w-5 h-5 animate-spin mr-2"
  }), loadingText) : children);
}
export function GameControls(_ref2) {
  var isLoadingNext = _ref2.isLoadingNext,
    revealAnswer = _ref2.revealAnswer,
    selectedOption = _ref2.selectedOption,
    isCorrectAnswer = _ref2.isCorrectAnswer,
    onConfirm = _ref2.onConfirm,
    onNext = _ref2.onNext,
    onEndGame = _ref2.onEndGame,
    checked = _ref2.checked,
    isCorrect = _ref2.isCorrect,
    gameEnded = _ref2.gameEnded,
    onCheckOrder = _ref2.onCheckOrder,
    onSeeResults = _ref2.onSeeResults;
  if (revealAnswer !== undefined) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-center mt-6"
    }, !revealAnswer ? /*#__PURE__*/React.createElement(Button, {
      className: "bg-primary hover:bg-primary/90 text-white px-6 py-4 text-base shadow-md",
      onClick: onConfirm,
      disabled: selectedOption === null || isLoadingNext
    }, /*#__PURE__*/React.createElement(Check, {
      className: "w-5 h-5 mr-2"
    }), " Confirm") : !isCorrectAnswer ? /*#__PURE__*/React.createElement(Button, {
      className: "bg-accent hover:bg-accent/90 text-white px-8 py-4 text-base shadow-md",
      onClick: onEndGame,
      disabled: isLoadingNext
    }, "See Results") : /*#__PURE__*/React.createElement(LoadingButton, {
      isLoading: isLoadingNext,
      onClick: onNext
    }, "Next Question"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center mt-6"
  }, !checked ? /*#__PURE__*/React.createElement(Button, {
    className: "bg-primary hover:bg-primary/90 text-white px-6 py-4 text-base shadow-md",
    onClick: onCheckOrder,
    disabled: isLoadingNext
  }, /*#__PURE__*/React.createElement(Check, {
    className: "w-5 h-5 mr-2"
  }), " Check Order") : !isCorrect ? /*#__PURE__*/React.createElement(Button, {
    className: "bg-accent hover:bg-accent/90 text-white px-8 py-4 text-base shadow-md",
    onClick: onSeeResults,
    disabled: isLoadingNext || gameEnded
  }, "See Results") : /*#__PURE__*/React.createElement(LoadingButton, {
    isLoading: isLoadingNext,
    onClick: onNext
  }, "Next Challenge"));
}
