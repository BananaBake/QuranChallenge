import { useQuery } from "@tanstack/react-query";
import { quranApi } from "../lib/api";
export function useSurahs() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _config$staleTime = config.staleTime,
    staleTime = _config$staleTime === void 0 ? 1000 * 60 * 60 : _config$staleTime,
    _config$retry = config.retry,
    retry = _config$retry === void 0 ? 2 : _config$retry,
    _config$refetchOnWind = config.refetchOnWindowFocus,
    refetchOnWindowFocus = _config$refetchOnWind === void 0 ? false : _config$refetchOnWind;
  return useQuery({
    queryKey: ['/api/quran/surahs'],
    queryFn: function queryFn() {
      return quranApi.getAllSurahs();
    },
    staleTime: staleTime,
    retry: retry,
    refetchOnWindowFocus: refetchOnWindowFocus
  });
}
export function useRandomAyahsForGame() {
  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _config$staleTime2 = config.staleTime,
    staleTime = _config$staleTime2 === void 0 ? 0 : _config$staleTime2,
    _config$retry2 = config.retry,
    retry = _config$retry2 === void 0 ? 3 : _config$retry2,
    _config$refetchOnWind2 = config.refetchOnWindowFocus,
    refetchOnWindowFocus = _config$refetchOnWind2 === void 0 ? false : _config$refetchOnWind2;
  return useQuery({
    queryKey: ['/api/quran/random-ayahs', count],
    queryFn: function queryFn() {
      return quranApi.getRandomAyahs(count);
    },
    staleTime: staleTime,
    retry: retry,
    refetchOnWindowFocus: refetchOnWindowFocus
  });
}
export function useRandomSurahsForGame() {
  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _config$staleTime3 = config.staleTime,
    staleTime = _config$staleTime3 === void 0 ? 0 : _config$staleTime3,
    _config$retry3 = config.retry,
    retry = _config$retry3 === void 0 ? 3 : _config$retry3,
    _config$refetchOnWind3 = config.refetchOnWindowFocus,
    refetchOnWindowFocus = _config$refetchOnWind3 === void 0 ? false : _config$refetchOnWind3;
  return useQuery({
    queryKey: ['/api/quran/random-surahs', count],
    queryFn: function queryFn() {
      return quranApi.getRandomSurahs(count);
    },
    staleTime: staleTime,
    retry: retry,
    refetchOnWindowFocus: refetchOnWindowFocus
  });
}
