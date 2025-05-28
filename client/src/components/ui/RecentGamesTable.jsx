import { formatDistanceToNow } from "date-fns";
import { Trophy, Clock } from "lucide-react";
export function RecentGamesTable(_ref) {
  var games = _ref.games;
  if (!games || games.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "text-center py-8 text-gray-500"
    }, /*#__PURE__*/React.createElement("p", null, "No recent games found."), /*#__PURE__*/React.createElement("p", {
      className: "text-sm mt-1"
    }, "Start playing to see your game history!"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, games.map(function (game) {
    var _game$gameType;
    return /*#__PURE__*/React.createElement("div", {
      key: game.id,
      className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center space-x-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex-shrink-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"
    }, /*#__PURE__*/React.createElement(Trophy, {
      className: "w-4 h-4 text-primary"
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "font-medium text-sm capitalize"
    }, ((_game$gameType = game.gameType) === null || _game$gameType === void 0 ? void 0 : _game$gameType.replace('_', ' ')) || 'Game'), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-500"
    }, formatDistanceToNow(new Date(game.completedAt), {
      addSuffix: true
    })))), /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("p", {
      className: "font-bold text-lg text-primary"
    }, game.score), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center text-xs text-gray-500"
    }, /*#__PURE__*/React.createElement(Clock, {
      className: "w-3 h-3 mr-1"
    }), game.timeSpent, "s")));
  }));
}
