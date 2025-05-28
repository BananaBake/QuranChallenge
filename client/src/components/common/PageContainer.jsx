import { memo } from 'react';
import { cn } from '@/lib/utils';
var PageHeader = /*#__PURE__*/memo(function (_ref) {
  var title = _ref.title,
    subtitle = _ref.subtitle;
  if (!title && !subtitle) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, title && /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-bold text-primary"
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 mt-1"
  }, subtitle));
});
PageHeader.displayName = "PageHeader";
export var PageContainer = /*#__PURE__*/memo(function (_ref2) {
  var children = _ref2.children,
    title = _ref2.title,
    subtitle = _ref2.subtitle,
    className = _ref2.className;
  return /*#__PURE__*/React.createElement("div", {
    className: cn("w-full max-w-4xl mx-auto", className)
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: title,
    subtitle: subtitle
  }), children);
});
PageContainer.displayName = "PageContainer";
