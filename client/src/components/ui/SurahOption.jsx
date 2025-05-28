import { cn } from "@/lib/utils";
export function SurahOption(_ref) {
  var name = _ref.name,
    arabicName = _ref.arabicName,
    number = _ref.number,
    _ref$showNumber = _ref.showNumber,
    showNumber = _ref$showNumber === void 0 ? false : _ref$showNumber,
    _ref$selected = _ref.selected,
    selected = _ref$selected === void 0 ? false : _ref$selected,
    _ref$correct = _ref.correct,
    correct = _ref$correct === void 0 ? false : _ref$correct,
    _ref$incorrect = _ref.incorrect,
    incorrect = _ref$incorrect === void 0 ? false : _ref$incorrect,
    onClick = _ref.onClick;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    className: cn("border-2 rounded-lg p-3 text-center transition duration-200 w-full", {
      "border-gray-300 hover:bg-secondary/10": !selected && !correct && !incorrect,
      "border-primary bg-primary/10": selected && !correct && !incorrect,
      "border-green-500 bg-green-100": correct,
      "border-red-500 bg-red-100": incorrect
    })
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-md"
  }, name), showNumber && number && /*#__PURE__*/React.createElement("span", {
    className: "block text-xs text-gray-500 mt-1"
  }, "Surah ", number));
}
