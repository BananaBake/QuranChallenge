import { ArabesqueBorder } from "./ArabesqueBorder";
export function StatsCard(_ref) {
  var title = _ref.title,
    value = _ref.value,
    Icon = _ref.icon,
    subtitle = _ref.subtitle;
  return /*#__PURE__*/React.createElement(ArabesqueBorder, {
    className: "h-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 text-center"
  }, Icon && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center mb-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    className: "w-6 h-6 text-primary"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-medium text-gray-600 mb-1"
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "text-center text-3xl font-bold text-primary"
  }, value), subtitle && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 mt-1"
  }, subtitle)));
}
