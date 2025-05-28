import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
export function useAlertMessage() {
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    messages = _useState2[0],
    setMessages = _useState2[1];
  var showMessage = function showMessage(props) {
    var id = Date.now().toString();
    var newMessage = _objectSpread(_objectSpread({}, props), {}, {
      id: id
    });
    setMessages(function (prev) {
      return [].concat(_toConsumableArray(prev), [newMessage]);
    });
    if (props.duration !== 0) {
      var duration = props.duration || 5000;
      setTimeout(function () {
        dismissMessage(id);
      }, duration);
    }
    return id;
  };
  var dismissMessage = function dismissMessage(id) {
    setMessages(function (prev) {
      return prev.filter(function (message) {
        return message.id !== id;
      });
    });
  };
  return {
    messages: messages,
    showMessage: showMessage,
    dismissMessage: dismissMessage
  };
}
export function AlertMessage(_ref) {
  var title = _ref.title,
    description = _ref.description,
    _ref$variant = _ref.variant,
    variant = _ref$variant === void 0 ? "default" : _ref$variant,
    onClose = _ref.onClose;
  return /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -20
    },
    className: cn("relative flex w-full items-center justify-between overflow-hidden rounded-lg border p-4 pr-8 shadow-lg", variant === "destructive" && "border-red-500 bg-red-50 text-red-800", variant === "success" && "border-green-500 bg-green-50 text-green-800", variant === "default" && "border-primary/20 bg-primary/5 text-primary-foreground")
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, variant === "destructive" && /*#__PURE__*/React.createElement(AlertCircle, {
    className: "h-5 w-5 text-red-600"
  }), variant === "success" && /*#__PURE__*/React.createElement(CheckCircle, {
    className: "h-5 w-5 text-green-600"
  }), variant === "default" && /*#__PURE__*/React.createElement(CheckCircle, {
    className: "h-5 w-5 text-primary"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-1"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-bold"
  }, title), description && /*#__PURE__*/React.createElement("div", {
    className: "text-sm"
  }, description))), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: cn("absolute right-2 top-2 rounded-md p-1 transition-opacity hover:opacity-100", variant === "destructive" ? "text-red-700 hover:bg-red-100" : variant === "success" ? "text-green-700 hover:bg-green-100" : "text-primary/70 hover:bg-primary/10")
  }, /*#__PURE__*/React.createElement(X, {
    className: "h-4 w-4"
  })));
}
export function AlertMessagesContainer(_ref2) {
  var messages = _ref2.messages,
    onDismiss = _ref2.onDismiss;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col gap-3 p-4 md:max-w-[420px]"
  }, /*#__PURE__*/React.createElement(AnimatePresence, null, messages.map(function (message) {
    return /*#__PURE__*/React.createElement(AlertMessage, {
      key: message.id,
      title: message.title,
      description: message.description,
      variant: message.variant,
      onClose: function onClose() {
        return onDismiss(message.id);
      }
    });
  })));
}
