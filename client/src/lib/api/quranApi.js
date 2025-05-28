import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { apiRequest } from "../queryClient";
export var quranApi = {
  getAllSurahs: function getAllSurahs() {
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", apiRequest('/api/quran/surahs'));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  },
  getRandomAyahs: function getRandomAyahs() {
    var _arguments = arguments;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var count;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            count = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : 10;
            return _context2.abrupt("return", apiRequest("/api/quran/random-ayahs?count=".concat(count)));
          case 2:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
  },
  getRandomSurahs: function getRandomSurahs() {
    var _arguments2 = arguments;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      var count;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            count = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : 5;
            return _context3.abrupt("return", apiRequest("/api/quran/random-surahs?count=".concat(count)));
          case 2:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))();
  },
  getAyahAudio: function getAyahAudio(ayahRef) {
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", apiRequest("/api/quran/audio/".concat(ayahRef)));
          case 1:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }))();
  }
};
