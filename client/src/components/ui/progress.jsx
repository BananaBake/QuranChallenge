import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
var _excluded = ["className", "value"];
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
var Progress = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var className = _ref.className,
    value = _ref.value,
    props = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(ProgressPrimitive.Root, _extends({
    ref: ref,
    className: cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)
  }, props), /*#__PURE__*/React.createElement(ProgressPrimitive.Indicator, {
    className: "h-full w-full flex-1 bg-primary transition-all",
    style: {
      transform: "translateX(-".concat(100 - (value || 0), "%)")
    }
  }));
});
Progress.displayName = ProgressPrimitive.Root.displayName;
export { Progress };
