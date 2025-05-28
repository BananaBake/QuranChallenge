import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getGameHistory, getGameStats as getLocalGameStats, saveGameHistory as saveLocalGameHistory } from "../localStorageService";
import { updateAchievements } from "../trophyService";
export var gameStatsApi = {
  getGameStats: function getGameStats() {
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", getLocalGameStats());
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  },
  getRecentGames: function getRecentGames() {
    var _arguments = arguments;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var limit, history;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            limit = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : 5;
            history = getGameHistory();
            return _context2.abrupt("return", history.slice(0, limit));
          case 3:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
  },
  saveGameResult: function saveGameResult(gameData) {
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      var savedGame;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            savedGame = saveLocalGameHistory(gameData);
            updateAchievements(savedGame);
            return _context3.abrupt("return", savedGame);
          case 3:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))();
  }
};
