import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
var _excluded = ["className"],
  _excluded2 = ["className"],
  _excluded3 = ["className"];
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
var Tabs = TabsPrimitive.Root;
var TabsList = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var className = _ref.className,
    props = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(TabsPrimitive.List, _extends({
    ref: ref,
    className: cn("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500", className)
  }, props));
});
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = /*#__PURE__*/React.forwardRef(function (_ref2, ref) {
  var className = _ref2.className,
    props = _objectWithoutProperties(_ref2, _excluded2);
  return /*#__PURE__*/React.createElement(TabsPrimitive.Trigger, _extends({
    ref: ref,
    className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50", className)
  }, props));
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = /*#__PURE__*/React.forwardRef(function (_ref3, ref) {
  var className = _ref3.className,
    props = _objectWithoutProperties(_ref3, _excluded3);
  return /*#__PURE__*/React.createElement(TabsPrimitive.Content, _extends({
    ref: ref,
    className: cn("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300", className)
  }, props));
});
TabsContent.displayName = TabsPrimitive.Content.displayName;
export { Tabs, TabsList, TabsTrigger, TabsContent };
