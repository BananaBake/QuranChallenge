import React from 'react';
export function LoadingSpinner(_ref) {
  var _ref$message = _ref.message,
    message = _ref$message === void 0 ? "Loading..." : _ref$message;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center h-[60vh]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center p-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, message), /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"
  })));
}
