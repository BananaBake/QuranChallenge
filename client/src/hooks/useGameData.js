import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { useState, useCallback, useEffect } from 'react';
import { useRandomAyahsForGame, useRandomSurahsForGame, useSurahs } from './useQuranData';
import { quranApi } from '../lib/api';
export function useIdentifySurahData() {
  var _useSurahs = useSurahs(),
    allSurahs = _useSurahs.data;
  var _useRandomAyahsForGam = useRandomAyahsForGame(5),
    ayahs = _useRandomAyahsForGam.data,
    isAyahsLoading = _useRandomAyahsForGam.isLoading;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    currentAyah = _useState2[0],
    setCurrentAyah = _useState2[1];
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    options = _useState4[0],
    setOptions = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    isLoadingNext = _useState6[0],
    setIsLoadingNext = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    error = _useState8[0],
    setError = _useState8[1];
  var generateOptionsForAyah = useCallback(function (ayah, surahs) {
    if (!ayah || !surahs.length) return [];
    var availableSurahs = surahs.filter(function (s) {
      return s.number !== ayah.surah.number;
    });
    var incorrectOptions = [];
    var usedIndices = new Set();
    while (incorrectOptions.length < 3 && incorrectOptions.length < availableSurahs.length) {
      var randomIndex = Math.floor(Math.random() * availableSurahs.length);
      if (!usedIndices.has(randomIndex)) {
        incorrectOptions.push({
          name: availableSurahs[randomIndex].englishName,
          arabicName: availableSurahs[randomIndex].name,
          number: availableSurahs[randomIndex].number
        });
        usedIndices.add(randomIndex);
      }
    }
    var correctOption = {
      name: ayah.surah.englishName,
      arabicName: ayah.surah.name,
      number: ayah.surah.number
    };
    var position = Math.floor(Math.random() * 4);
    incorrectOptions.splice(position, 0, correctOption);
    return incorrectOptions;
  }, []);
  var loadNextQuestion = useCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    var data, ayah, newOptions;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(!allSurahs || !allSurahs.length)) {
            _context.next = 3;
            break;
          }
          setError("Surah data not available. Please try again.");
          return _context.abrupt("return", null);
        case 3:
          setIsLoadingNext(true);
          _context.prev = 4;
          _context.next = 7;
          return quranApi.getRandomAyahs(1);
        case 7:
          data = _context.sent;
          if (!(data && data.length > 0)) {
            _context.next = 14;
            break;
          }
          ayah = data[0];
          setCurrentAyah(ayah);
          newOptions = generateOptionsForAyah(ayah, allSurahs);
          setOptions(newOptions);
          return _context.abrupt("return", ayah);
        case 14:
          setError("Failed to fetch the next question. Please try again.");
          return _context.abrupt("return", null);
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](4);
          setError("Failed to fetch the next question. Please try again.");
          return _context.abrupt("return", null);
        case 22:
          _context.prev = 22;
          setIsLoadingNext(false);
          return _context.finish(22);
        case 25:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[4, 18, 22, 25]]);
  })), [allSurahs, generateOptionsForAyah]);
  var initializeQuestion = useCallback(function (ayah, surahs) {
    setCurrentAyah(ayah);
    var newOptions = generateOptionsForAyah(ayah, surahs);
    setOptions(newOptions);
  }, [generateOptionsForAyah]);
  useEffect(function () {
    if (!isAyahsLoading && ayahs && ayahs.length > 0 && allSurahs && allSurahs.length > 0 && !currentAyah) {
      initializeQuestion(ayahs[0], allSurahs);
    }
  }, [ayahs, allSurahs, isAyahsLoading, currentAyah, initializeQuestion]);
  return {
    ayahs: ayahs,
    isLoading: isAyahsLoading || !allSurahs,
    currentAyah: currentAyah,
    options: options,
    isLoadingNext: isLoadingNext,
    error: error,
    setError: setError,
    initializeQuestion: initializeQuestion,
    loadNextQuestion: loadNextQuestion,
    generateOptionsForAyah: generateOptionsForAyah
  };
}
export function useSurahOrderingData() {
  var _useRandomSurahsForGa = useRandomSurahsForGame(5),
    originalSurahs = _useRandomSurahsForGa.data,
    isLoading = _useRandomSurahsForGa.isLoading;
  var _useState9 = useState([]),
    _useState0 = _slicedToArray(_useState9, 2),
    surahs = _useState0[0],
    setSurahs = _useState0[1];
  var _useState1 = useState(false),
    _useState10 = _slicedToArray(_useState1, 2),
    isLoadingNext = _useState10[0],
    setIsLoadingNext = _useState10[1];
  var _useState11 = useState(null),
    _useState12 = _slicedToArray(_useState11, 2),
    error = _useState12[0],
    setError = _useState12[1];
  var shuffleSurahs = useCallback(function (surahList) {
    if (!surahList || surahList.length === 0) return [];
    return _toConsumableArray(surahList).sort(function () {
      return Math.random() - 0.5;
    });
  }, []);
  var loadNextQuestion = useCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
    var data, shuffled;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          setIsLoadingNext(true);
          _context2.prev = 1;
          _context2.next = 4;
          return quranApi.getRandomSurahs(5);
        case 4:
          data = _context2.sent;
          if (!(data && data.length > 0)) {
            _context2.next = 9;
            break;
          }
          shuffled = shuffleSurahs(data);
          setSurahs(shuffled);
          return _context2.abrupt("return", shuffled);
        case 9:
          setError("Failed to fetch the next question. Please try again.");
          return _context2.abrupt("return", null);
        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](1);
          setError("Failed to fetch the next question. Please try again.");
          return _context2.abrupt("return", null);
        case 17:
          _context2.prev = 17;
          setIsLoadingNext(false);
          return _context2.finish(17);
        case 20:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 13, 17, 20]]);
  })), [shuffleSurahs]);
  var handleMoveSurah = useCallback(function (dragIndex, hoverIndex) {
    if (!surahs.length) return;
    var newItems = _toConsumableArray(surahs);
    var dragItem = newItems[dragIndex];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    setSurahs(newItems);
  }, [surahs]);
  var checkCorrectOrder = useCallback(function () {
    if (!surahs.length) return false;
    return surahs.every(function (surah, index, array) {
      return index === 0 || surah.number > array[index - 1].number;
    });
  }, [surahs]);
  var initializeSurahs = useCallback(function (provided) {
    var shuffled = shuffleSurahs(provided);
    setSurahs(shuffled);
  }, [shuffleSurahs]);
  useEffect(function () {
    if (!isLoading && originalSurahs && originalSurahs.length > 0 && surahs.length === 0) {
      initializeSurahs(originalSurahs);
    }
  }, [originalSurahs, isLoading, surahs.length, initializeSurahs]);
  return {
    originalSurahs: originalSurahs,
    surahs: surahs,
    isLoading: isLoading,
    isLoadingNext: isLoadingNext,
    error: error,
    setError: setError,
    initializeSurahs: initializeSurahs,
    loadNextQuestion: loadNextQuestion,
    handleMoveSurah: handleMoveSurah,
    checkCorrectOrder: checkCorrectOrder
  };
}
