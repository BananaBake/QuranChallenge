import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gameStatsApi } from "../lib/api";
export function useGameStats() {
  return useQuery({
    queryKey: ['gameStats'],
    queryFn: function queryFn() {
      return gameStatsApi.getGameStats();
    },
    staleTime: 60 * 1000
  });
}
export function useRecentGames() {
  var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
  return useQuery({
    queryKey: ['recentGames', limit],
    queryFn: function queryFn() {
      return gameStatsApi.getRecentGames(limit);
    },
    staleTime: 60 * 1000
  });
}
export function useSaveGameResult() {
  var queryClient = useQueryClient();
  return useMutation({
    mutationFn: function () {
      var _mutationFn = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(gameData) {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", gameStatsApi.saveGameResult(gameData));
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function mutationFn(_x) {
        return _mutationFn.apply(this, arguments);
      }
      return mutationFn;
    }(),
    onSuccess: function onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['gameStats']
      });
      queryClient.invalidateQueries({
        queryKey: ['recentGames']
      });
      queryClient.invalidateQueries({
        queryKey: ['achievements']
      });
    },
    onError: function onError() {
      if (window.showAlertMessage) {
        window.showAlertMessage({
          title: "Error",
          description: "Failed to save your game results",
          variant: "destructive"
        });
      }
    }
  });
}
