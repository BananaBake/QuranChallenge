import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { achievementApi } from '../lib/api';
import { incrementHighScoreBeatenCount } from '../lib/localStorageService';
export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: function () {
      var _queryFn = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return achievementApi.getAllAchievements();
            case 3:
              return _context.abrupt("return", _context.sent);
            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);
              if (window.showAlertMessage) {
                window.showAlertMessage({
                  title: "Error",
                  description: "Could not load your achievements",
                  variant: "destructive"
                });
              }
              throw _context.t0;
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 6]]);
      }));
      function queryFn() {
        return _queryFn.apply(this, arguments);
      }
      return queryFn;
    }()
  });
}
export function useAchievementNotifications() {
  var queryClient = useQueryClient();
  var checkForNewAchievements = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var newAchievements;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return achievementApi.getNewAchievements();
          case 2:
            newAchievements = _context2.sent;
            return _context2.abrupt("return", newAchievements);
          case 4:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function checkForNewAchievements() {
      return _ref.apply(this, arguments);
    };
  }();
  var checkProgress = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      var newAchievements;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return achievementApi.checkAchievementProgress();
          case 2:
            newAchievements = _context3.sent;
            if (newAchievements.length > 0) {
              queryClient.invalidateQueries({
                queryKey: ['achievements']
              });
            }
            return _context3.abrupt("return", newAchievements);
          case 5:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function checkProgress() {
      return _ref2.apply(this, arguments);
    };
  }();
  var handleHighScoreAchievements = function handleHighScoreAchievements(currentScore, previousHighScore) {
    if (currentScore <= previousHighScore) return false;
    incrementHighScoreBeatenCount();
    var highScoreAchievements = achievementApi.checkAchievementProgress();
    if (highScoreAchievements instanceof Promise) {
      highScoreAchievements.then(function (achievements) {
        if (achievements.length > 0) {
          queryClient.invalidateQueries({
            queryKey: ['achievements']
          });
        }
      });
    }
    return true;
  };
  var updateStreakAchievements = function updateStreakAchievements(gameType, score) {
    var mockGame = {
      id: Date.now(),
      userId: 1,
      gameType: gameType,
      score: score,
      maxScore: score,
      timeSpent: 0,
      completedAt: new Date()
    };
    return [];
  };
  return {
    checkForNewAchievements: checkForNewAchievements,
    checkProgress: checkProgress,
    handleHighScoreAchievements: handleHighScoreAchievements,
    updateStreakAchievements: updateStreakAchievements
  };
}
