import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { useState, useEffect, useCallback } from 'react';
export function useGameTimer() {
  var isRunning = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    startTime = _useState2[0],
    setStartTime = _useState2[1];
  var _useState3 = useState(0),
    _useState4 = _slicedToArray(_useState3, 2),
    timeSpent = _useState4[0],
    setTimeSpent = _useState4[1];
  var _useState5 = useState("00:00"),
    _useState6 = _slicedToArray(_useState5, 2),
    formattedTime = _useState6[0],
    setFormattedTime = _useState6[1];
  useEffect(function () {
    if (isRunning && !startTime) {
      setStartTime(new Date());
    } else if (!isRunning && startTime) {
      var now = new Date();
      var diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setTimeSpent(diff);
    }
  }, [isRunning, startTime]);
  useEffect(function () {
    if (!startTime || !isRunning) return;
    var formatTime = function formatTime(seconds) {
      var minutes = Math.floor(seconds / 60);
      var remainingSeconds = seconds % 60;
      return "".concat(minutes.toString().padStart(2, '0'), ":").concat(remainingSeconds.toString().padStart(2, '0'));
    };
    var intervalId = setInterval(function () {
      var now = new Date();
      var diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setTimeSpent(diff);
      setFormattedTime(formatTime(diff));
    }, 1000);
    return function () {
      return clearInterval(intervalId);
    };
  }, [startTime, isRunning]);
  var resetTimer = useCallback(function () {
    setStartTime(isRunning ? new Date() : null);
    setTimeSpent(0);
    setFormattedTime("00:00");
  }, [isRunning]);
  return {
    timeSpent: timeSpent,
    formattedTime: formattedTime,
    resetTimer: resetTimer
  };
}
