import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { QueryClient } from "@tanstack/react-query";
function throwIfResNotOk(_x) {
  return _throwIfResNotOk.apply(this, arguments);
}
function _throwIfResNotOk() {
  _throwIfResNotOk = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(res) {
    var text;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (res.ok) {
            _context2.next = 8;
            break;
          }
          _context2.next = 3;
          return res.text();
        case 3:
          _context2.t0 = _context2.sent;
          if (_context2.t0) {
            _context2.next = 6;
            break;
          }
          _context2.t0 = res.statusText;
        case 6:
          text = _context2.t0;
          throw new Error("".concat(res.status, ": ").concat(text));
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _throwIfResNotOk.apply(this, arguments);
}
export function apiRequest(_x2, _x3) {
  return _apiRequest.apply(this, arguments);
}
function _apiRequest() {
  _apiRequest = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3(url, options) {
    var res;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return fetch(url, _objectSpread(_objectSpread({}, options), {}, {
            credentials: "include",
            headers: _objectSpread(_objectSpread({}, (options === null || options === void 0 ? void 0 : options.headers) || {}), options !== null && options !== void 0 && options.body ? {
              "Content-Type": "application/json"
            } : {})
          }));
        case 2:
          res = _context3.sent;
          _context3.next = 5;
          return throwIfResNotOk(res);
        case 5:
          _context3.next = 7;
          return res.json();
        case 7:
          return _context3.abrupt("return", _context3.sent);
        case 8:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _apiRequest.apply(this, arguments);
}
export function apiPost(_x4, _x5) {
  return _apiPost.apply(this, arguments);
}
function _apiPost() {
  _apiPost = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee4(url, data) {
    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", apiRequest(url, {
            method: 'POST',
            body: JSON.stringify(data)
          }));
        case 1:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _apiPost.apply(this, arguments);
}
export var getQueryFn = function getQueryFn(_ref) {
  var unauthorizedBehavior = _ref.on401;
  return /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(_ref2) {
      var queryKey, url, queryParams, paramName, res;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            queryKey = _ref2.queryKey;
            url = queryKey[0];
            queryParams = '';
            if (queryKey.length > 1 && typeof queryKey[1] === 'number') {
              paramName = url.includes('random-ayahs') ? 'count' : url.includes('random-surahs') ? 'count' : '';
              if (paramName) {
                queryParams = "?".concat(paramName, "=").concat(queryKey[1]);
              }
            }
            _context.next = 6;
            return fetch("".concat(url).concat(queryParams), {
              credentials: "include"
            });
          case 6:
            res = _context.sent;
            if (!(unauthorizedBehavior === "returnNull" && res.status === 401)) {
              _context.next = 9;
              break;
            }
            return _context.abrupt("return", null);
          case 9:
            _context.next = 11;
            return throwIfResNotOk(res);
          case 11:
            _context.next = 13;
            return res.json();
          case 13:
            return _context.abrupt("return", _context.sent);
          case 14:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x6) {
      return _ref3.apply(this, arguments);
    };
  }();
};
export var queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({
        on401: "throw"
      }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1
    },
    mutations: {
      retry: false
    }
  }
});
