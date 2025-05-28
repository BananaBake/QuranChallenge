import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { useState, useRef, useEffect } from "react";
import { ArabesqueBorder } from "./ArabesqueBorder";
import { Play, Pause, Loader2 } from "lucide-react";
import { Button } from "./button";
import axios from "axios";
function AudioButton(_ref) {
  var isLoading = _ref.isLoading,
    isPlaying = _ref.isPlaying,
    disabled = _ref.disabled,
    onClick = _ref.onClick;
  var icon;
  var text;
  if (isLoading) {
    icon = /*#__PURE__*/React.createElement(Loader2, {
      className: "h-4 w-4 animate-spin"
    });
    text = "Loading";
  } else if (isPlaying) {
    icon = /*#__PURE__*/React.createElement(Pause, {
      className: "h-4 w-4"
    });
    text = "Pause";
  } else {
    icon = /*#__PURE__*/React.createElement(Play, {
      className: "h-4 w-4"
    });
    text = "Listen";
  }
  return /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    className: "flex items-center gap-2 text-primary hover:bg-primary/10",
    onClick: onClick,
    disabled: disabled || isLoading
  }, icon, /*#__PURE__*/React.createElement("span", null, text));
}
export function QuranText(_ref2) {
  var arabicText = _ref2.arabicText,
    audioUrl = _ref2.audioUrl,
    ayahRef = _ref2.ayahRef;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isPlaying = _useState2[0],
    setIsPlaying = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isLoading = _useState4[0],
    setIsLoading = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    audioError = _useState6[0],
    setAudioError = _useState6[1];
  var audioRef = useRef(null);
  var currentAyahRef = useRef(ayahRef);
  var abortControllerRef = useRef(null);
  useEffect(function () {
    if (ayahRef !== currentAyahRef.current) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsPlaying(false);
      setIsLoading(false);
      setAudioError(null);
      currentAyahRef.current = ayahRef;
    }
  }, [ayahRef]);
  useEffect(function () {
    return function () {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  var loadAndPlayAudio = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var audio, response, _audio;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(isPlaying && audioRef.current)) {
              _context.next = 4;
              break;
            }
            audioRef.current.pause();
            setIsPlaying(false);
            return _context.abrupt("return");
          case 4:
            if (!audioRef.current) {
              _context.next = 16;
              break;
            }
            _context.prev = 5;
            _context.next = 8;
            return audioRef.current.play();
          case 8:
            setIsPlaying(true);
            setAudioError(null);
            _context.next = 15;
            break;
          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](5);
            setAudioError("Unable to play audio. Please try again.");
          case 15:
            return _context.abrupt("return");
          case 16:
            setIsLoading(true);
            if (abortControllerRef.current) {
              abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();
            _context.prev = 19;
            if (!audioUrl) {
              _context.next = 29;
              break;
            }
            audio = new Audio(audioUrl);
            setupAudioEvents(audio);
            audioRef.current = audio;
            _context.next = 26;
            return audio.play();
          case 26:
            setIsPlaying(true);
            _context.next = 46;
            break;
          case 29:
            if (!ayahRef) {
              _context.next = 45;
              break;
            }
            _context.next = 32;
            return axios.get("/api/quran/audio/".concat(ayahRef), {
              signal: abortControllerRef.current.signal
            });
          case 32:
            response = _context.sent;
            if (!(response.data && response.data.audio)) {
              _context.next = 42;
              break;
            }
            _audio = new Audio(response.data.audio);
            setupAudioEvents(_audio);
            audioRef.current = _audio;
            _context.next = 39;
            return _audio.play();
          case 39:
            setIsPlaying(true);
            _context.next = 43;
            break;
          case 42:
            setAudioError("Audio not available for this ayah.");
          case 43:
            _context.next = 46;
            break;
          case 45:
            setAudioError("No audio source available.");
          case 46:
            _context.next = 53;
            break;
          case 48:
            _context.prev = 48;
            _context.t1 = _context["catch"](19);
            if (!axios.isCancel(_context.t1)) {
              _context.next = 52;
              break;
            }
            return _context.abrupt("return");
          case 52:
            if (_context.t1 instanceof Error) {
              setAudioError("Audio loading failed: ".concat(_context.t1.message));
            } else {
              setAudioError("Failed to load audio. Please try again.");
            }
          case 53:
            _context.prev = 53;
            setIsLoading(false);
            abortControllerRef.current = null;
            return _context.finish(53);
          case 57:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[5, 12], [19, 48, 53, 57]]);
    }));
    return function loadAndPlayAudio() {
      return _ref3.apply(this, arguments);
    };
  }();
  var setupAudioEvents = function setupAudioEvents(audio) {
    audio.addEventListener('ended', function () {
      setIsPlaying(false);
    });
    audio.addEventListener('pause', function () {
      setIsPlaying(false);
    });
    audio.addEventListener('error', function () {
      setAudioError("Failed to play audio file.");
      setIsPlaying(false);
    });
  };
  var hasAudioSource = audioUrl || ayahRef;
  return /*#__PURE__*/React.createElement(ArabesqueBorder, {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center text-2xl leading-relaxed mb-4 font-arabic text-primary"
  }, arabicText), hasAudioSource && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center"
  }, /*#__PURE__*/React.createElement(AudioButton, {
    isLoading: isLoading,
    isPlaying: isPlaying,
    onClick: loadAndPlayAudio,
    disabled: !!audioError
  })), audioError && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 text-center text-sm text-red-600"
  }, audioError)));
}
