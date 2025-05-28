import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { useState, useRef } from "react";
import { GripVertical } from "lucide-react";
export function DraggableSurah(_ref) {
  var name = _ref.name,
    arabicName = _ref.arabicName,
    number = _ref.number,
    index = _ref.index,
    onMoveItem = _ref.onMoveItem,
    _ref$showNumber = _ref.showNumber,
    showNumber = _ref$showNumber === void 0 ? false : _ref$showNumber;
  var ref = useRef(null);
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isDragging = _useState2[0],
    setIsDragging = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    touchY = _useState4[0],
    setTouchY = _useState4[1];
  var handleTouchStart = function handleTouchStart(e) {
    setTouchY(e.touches[0].clientY);
  };
  var handleTouchMove = function handleTouchMove(e) {
    if (touchY === null) return;
    var currentY = e.touches[0].clientY;
    var element = ref.current;
    var container = element === null || element === void 0 ? void 0 : element.parentElement;
    if (!element || !container) return;
    var elementsBelow = document.elementsFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    var droppableBelow = elementsBelow.find(function (el) {
      return el !== element && el.getAttribute('data-draggable-index') !== null;
    });
    if (droppableBelow) {
      var hoverIndex = Number(droppableBelow.getAttribute('data-draggable-index'));
      if (hoverIndex !== index) {
        onMoveItem(index, hoverIndex);
      }
    }
  };
  var handleTouchEnd = function handleTouchEnd() {
    setTouchY(null);
  };
  var handleDragStart = function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', index.toString());
    setIsDragging(true);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.6';
    }
  };
  var handleDragEnd = function handleDragEnd(e) {
    setIsDragging(false);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };
  var handleDragOver = function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  var handleDrop = function handleDrop(e) {
    e.preventDefault();
    var dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (dragIndex !== index) {
      onMoveItem(dragIndex, index);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    draggable: true,
    "data-draggable-index": index,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    className: "border-2 ".concat(isDragging ? 'border-primary' : 'border-gray-300', " bg-white rounded-lg p-4 flex justify-between items-center cursor-move shadow-sm mb-3 hover:border-primary transition-colors")
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-secondary/20 text-secondary w-10 h-10 rounded-full flex items-center justify-center mr-4"
  }, /*#__PURE__*/React.createElement(GripVertical, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-english font-bold text-md"
  }, name))), showNumber && /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xl bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center"
  }, number));
}
