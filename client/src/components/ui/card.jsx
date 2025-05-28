import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
var _excluded = ["className"],
  _excluded2 = ["className"],
  _excluded3 = ["className"],
  _excluded4 = ["className"],
  _excluded5 = ["className"],
  _excluded6 = ["className"];
import * as React from "react";
import { cn } from "@/lib/utils";
var Card = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var className = _ref.className,
    props = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    className: cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)
  }, props));
});
Card.displayName = "Card";
var CardHeader = /*#__PURE__*/React.forwardRef(function (_ref2, ref) {
  var className = _ref2.className,
    props = _objectWithoutProperties(_ref2, _excluded2);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    className: cn("flex flex-col space-y-1.5 p-6", className)
  }, props));
});
CardHeader.displayName = "CardHeader";
var CardTitle = /*#__PURE__*/React.forwardRef(function (_ref3, ref) {
  var className = _ref3.className,
    props = _objectWithoutProperties(_ref3, _excluded3);
  return /*#__PURE__*/React.createElement("h3", _extends({
    ref: ref,
    className: cn("text-2xl font-semibold leading-none tracking-tight", className)
  }, props));
});
CardTitle.displayName = "CardTitle";
var CardDescription = /*#__PURE__*/React.forwardRef(function (_ref4, ref) {
  var className = _ref4.className,
    props = _objectWithoutProperties(_ref4, _excluded4);
  return /*#__PURE__*/React.createElement("p", _extends({
    ref: ref,
    className: cn("text-sm text-muted-foreground", className)
  }, props));
});
CardDescription.displayName = "CardDescription";
var CardContent = /*#__PURE__*/React.forwardRef(function (_ref5, ref) {
  var className = _ref5.className,
    props = _objectWithoutProperties(_ref5, _excluded5);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    className: cn("p-6 pt-0", className)
  }, props));
});
CardContent.displayName = "CardContent";
var CardFooter = /*#__PURE__*/React.forwardRef(function (_ref6, ref) {
  var className = _ref6.className,
    props = _objectWithoutProperties(_ref6, _excluded6);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    className: cn("flex items-center p-6 pt-0", className)
  }, props));
});
CardFooter.displayName = "CardFooter";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
