import { Link } from "wouter";
import { memo } from "react";
import { Home, Search, ArrowUpDown, Trophy } from "lucide-react";
var NavItem = /*#__PURE__*/memo(function (_ref) {
  var href = _ref.href,
    Icon = _ref.icon,
    label = _ref.label,
    isActive = _ref.isActive;
  return /*#__PURE__*/React.createElement(Link, {
    href: href,
    className: "w-1/4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center py-2 px-4 w-full h-full\n      ".concat(isActive ? "text-primary" : "text-gray-500", " \n      hover:text-primary/80 transition-colors duration-200")
  }, /*#__PURE__*/React.createElement(Icon, {
    className: "w-5 h-5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs mt-1"
  }, label)));
});
NavItem.displayName = "NavItem";
export default function BottomNavigation(_ref2) {
  var currentPath = _ref2.currentPath;
  var navItems = [{
    href: "/",
    icon: Home,
    label: "Home"
  }, {
    href: "/identify-surah",
    icon: Search,
    label: "Identify"
  }, {
    href: "/surah-ordering",
    icon: ArrowUpDown,
    label: "Ordering"
  }, {
    href: "/achievements",
    icon: Trophy,
    label: "Trophies"
  }];
  return /*#__PURE__*/React.createElement("nav", {
    className: "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full px-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-around items-center h-16"
  }, navItems.map(function (item) {
    return /*#__PURE__*/React.createElement(NavItem, {
      key: item.href,
      href: item.href,
      icon: item.icon,
      label: item.label,
      isActive: currentPath === item.href
    });
  }))));
}
