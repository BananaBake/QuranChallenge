import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getAchievements as getLocalAchievements, getNewlyUnlockedAchievements, clearNewlyUnlockedIds, checkAchievementsProgress } from '../trophyService';
export var achievementApi = {
  getAllAchievements: function getAllAchievements() {
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", getLocalAchievements());
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  },
  getNewAchievements: function getNewAchievements() {
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", getNewlyUnlockedAchievements());
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
  },
  clearNewAchievementNotifications: function clearNewAchievementNotifications() {
    clearNewlyUnlockedIds();
  },
  checkAchievementProgress: function checkAchievementProgress() {
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", checkAchievementsProgress());
          case 1:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))();
  }
};
