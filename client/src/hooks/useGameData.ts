import { useState, useCallback, useEffect } from 'react';
import { useRandomAyahsForGame, useRandomSurahsForGame, useSurahs } from './useQuranData';
import { Ayah, Surah } from '@shared/schema';
import { quranApi } from '../lib/api';
export function useIdentifySurahData() {
  const { data: allSurahs } = useSurahs();
  const { data: ayahs, isLoading: isAyahsLoading } = useRandomAyahsForGame(5);
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [options, setOptions] = useState<Array<{ name: string, arabicName: string, number: number }>>([]);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generateOptionsForAyah = useCallback((ayah: Ayah, surahs: Surah[]) => {
    if (!ayah || !surahs.length) return [];
    const availableSurahs = surahs.filter(s => s.number !== ayah.surah.number);
    const incorrectOptions: Array<{ name: string, arabicName: string, number: number }> = [];
    const usedIndices = new Set<number>();
    while (incorrectOptions.length < 3 && incorrectOptions.length < availableSurahs.length) {
      const randomIndex = Math.floor(Math.random() * availableSurahs.length);
      if (!usedIndices.has(randomIndex)) {
        incorrectOptions.push({
          name: availableSurahs[randomIndex].englishName,
          arabicName: availableSurahs[randomIndex].name,
          number: availableSurahs[randomIndex].number
        });
        usedIndices.add(randomIndex);
      }
    }
    const correctOption = {
      name: ayah.surah.englishName,
      arabicName: ayah.surah.name,
      number: ayah.surah.number
    };
    const position = Math.floor(Math.random() * 4);
    incorrectOptions.splice(position, 0, correctOption);
    return incorrectOptions;
  }, []);
  const loadNextQuestion = useCallback(async () => {
    if (!allSurahs || !allSurahs.length) {
      setError("Surah data not available. Please try again.");
      return null;
    }
    setIsLoadingNext(true);
    try {
      const data = await quranApi.getRandomAyahs(1);
      if (data && data.length > 0) {
        const ayah = data[0];
        setCurrentAyah(ayah);
        const newOptions = generateOptionsForAyah(ayah, allSurahs);
        setOptions(newOptions);
        return ayah;
      }
      setError("Failed to fetch the next question. Please try again.");
      return null;
    } catch (error) {
      setError("Failed to fetch the next question. Please try again.");
      return null;
    } finally {
      setIsLoadingNext(false);
    }
  }, [allSurahs, generateOptionsForAyah]);
  const initializeQuestion = useCallback((ayah: Ayah, surahs: Surah[]) => {
    setCurrentAyah(ayah);
    const newOptions = generateOptionsForAyah(ayah, surahs);
    setOptions(newOptions);
  }, [generateOptionsForAyah]);
  useEffect(() => {
    if (!isAyahsLoading && ayahs && ayahs.length > 0 && allSurahs && allSurahs.length > 0 && !currentAyah) {
      initializeQuestion(ayahs[0], allSurahs);
    }
  }, [ayahs, allSurahs, isAyahsLoading, currentAyah, initializeQuestion]);
  return {
    ayahs,
    isLoading: isAyahsLoading || !allSurahs,
    currentAyah,
    options,
    isLoadingNext,
    error,
    setError,
    initializeQuestion,
    loadNextQuestion,
    generateOptionsForAyah
  };
}
export function useSurahOrderingData() {
  const { data: originalSurahs, isLoading } = useRandomSurahsForGame(5);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shuffleSurahs = useCallback((surahList: Surah[]) => {
    if (!surahList || surahList.length === 0) return [];
    return [...surahList].sort(() => Math.random() - 0.5);
  }, []);
  const loadNextQuestion = useCallback(async () => {
    setIsLoadingNext(true);
    try {
      const data = await quranApi.getRandomSurahs(5);
      if (data && data.length > 0) {
        const shuffled = shuffleSurahs(data);
        setSurahs(shuffled);
        return shuffled;
      }
      setError("Failed to fetch the next question. Please try again.");
      return null;
    } catch (error) {
      setError("Failed to fetch the next question. Please try again.");
      return null;
    } finally {
      setIsLoadingNext(false);
    }
  }, [shuffleSurahs]);
  const handleMoveSurah = useCallback((dragIndex: number, hoverIndex: number) => {
    if (!surahs.length) return;
    const newItems = [...surahs];
    const dragItem = newItems[dragIndex];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    setSurahs(newItems);
  }, [surahs]);
  const checkCorrectOrder = useCallback(() => {
    if (!surahs.length) return false;
    return surahs.every((surah, index, array) => 
      index === 0 || surah.number > array[index - 1].number
    );
  }, [surahs]);
  const initializeSurahs = useCallback((provided: Surah[]) => {
    const shuffled = shuffleSurahs(provided);
    setSurahs(shuffled);
  }, [shuffleSurahs]);
  useEffect(() => {
    if (!isLoading && originalSurahs && originalSurahs.length > 0 && surahs.length === 0) {
      initializeSurahs(originalSurahs);
    }
  }, [originalSurahs, isLoading, surahs.length, initializeSurahs]);
  return {
    originalSurahs,
    surahs,
    isLoading,
    isLoadingNext,
    error,
    setError,
    initializeSurahs,
    loadNextQuestion,
    handleMoveSurah,
    checkCorrectOrder
  };
}