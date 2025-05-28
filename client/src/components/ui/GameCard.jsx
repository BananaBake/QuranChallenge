import { Link } from "wouter";
import { Play } from "lucide-react";
import { Trophy, Clock, Star } from "lucide-react";
export function GameCard(_ref) {
  var title = _ref.title,
    description = _ref.description,
    path = _ref.path,
    stats = _ref.stats;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-lg text-primary"
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-gray-600 mt-1"
  }, description)), /*#__PURE__*/React.createElement(Link, {
    href: path
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-secondary hover:bg-secondary/90 text-white h-12 w-12 rounded-full flex items-center justify-center shadow-md transition-colors duration-300 ml-4"
  }, /*#__PURE__*/React.createElement(Play, {
    className: "w-6 h-6"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 grid grid-cols-3 gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center bg-gray-50 rounded-md p-2"
  }, /*#__PURE__*/React.createElement(Trophy, {
    className: "w-4 h-4 text-secondary mb-1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, stats.best), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 text-xs"
  }, "High Score")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center bg-gray-50 rounded-md p-2"
  }, /*#__PURE__*/React.createElement(Clock, {
    className: "w-4 h-4 text-primary mb-1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, stats.avgTime), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 text-xs"
  }, "Avg Time")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center bg-gray-50 rounded-md p-2"
  }, /*#__PURE__*/React.createElement(Star, {
    className: "w-4 h-4 text-secondary mb-1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, stats.played), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 text-xs"
  }, "Played")))));
}
