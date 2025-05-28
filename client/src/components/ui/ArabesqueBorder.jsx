export function ArabesqueBorder(_ref) {
  var children = _ref.children,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? "" : _ref$className;
  return /*#__PURE__*/React.createElement("div", {
    className: "relative rounded-lg p-0.5 bg-gradient-to-r from-secondary to-primary ".concat(className)
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-md bg-background h-full"
  }, children));
}
