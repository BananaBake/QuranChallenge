import { useState, useCallback, useEffect } from 'react';
import { useRandomAyahsForGame, useRandomSurahsForGame, useSurahs } from './useQuranData';
import { Ayah, Surah } from '@shared/schema';
import { quranApi } from '../lib/api';

/**
 * Hook for loading and managing Identify Surah game data
 */
export function useIdentifySurahData() {
  const { data: allSurahs } = useSurahs();
  const { data: ayahs, isLoading: isAyahsLoading } = useRandomAyahsForGame(5);
  
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [options, setOptions] = useState<Array<{ name: string, arabicName: string, number: number }>>([]);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Generate options for the current ayah
   */
  const generateOptionsForAyah = useCallback((ayah: Ayah, surahs: Surah[]) => {
    if (!ayah || !surahs.length) return [];
    
    // Get surahs other than the current one for incorrect options
    const availableSurahs = surahs.filter(s => s.number !== ayah.surah.number);
    
    // Create 3 incorrect options
    const incorrectOptions: Array<{ name: string, arabicName: string, number: number }> = [];
    const usedIndices = new Set<number>();
    
    // Ensure we have unique random surahs for options
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
    
    // Add the correct option
    const correctOption = {
      name: ayah.surah.englishName,
      arabicName: ayah.surah.name,
      number: ayah.surah.number
    };
    
    // Insert the correct option at a random position
    const position = Math.floor(Math.random() * 4);
    incorrectOptions.splice(position, 0, correctOption);
    
    return incorrectOptions;
  }, []);
  
  /**
   * Load the next question
   */
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
  
  /**
   * Initialize the first question
   */
  const initializeQuestion = useCallback((ayah: Ayah, surahs: Surah[]) => {
    setCurrentAyah(ayah);
    const newOptions = generateOptionsForAyah(ayah, surahs);
    setOptions(newOptions);
  }, [generateOptionsForAyah]);
  
  // Initialize when data is available
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

/**
 * Hook for loading and managing Surah Ordering game data
 */
export function useSurahOrderingData() {
  const { data: originalSurahs, isLoading } = useRandomSurahsForGame(5);
  
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Shuffle surahs into random order
   */
  const shuffleSurahs = useCallback((surahList: Surah[]) => {
    if (!surahList || surahList.length === 0) return [];
    
    // Create a copy to avoid mutating the original
    return [...surahList].sort(() => Math.random() - 0.5);
  }, []);
  
  /**
   * Load the next set of surahs
   */
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
  
  /**
   * Handle moving surahs during ordering
   */
  const handleMoveSurah = useCallback((dragIndex: number, hoverIndex: number) => {
    if (!surahs.length) return;
    
    // Create a copy of the current surahs array
    const newItems = [...surahs];
    
    // Remove the dragged item
    const dragItem = newItems[dragIndex];
    newItems.splice(dragIndex, 1);
    
    // Insert it at the new position
    newItems.splice(hoverIndex, 0, dragItem);
    
    // Update state
    setSurahs(newItems);
  }, [surahs]);
  
  /**
   * Check if the surahs are in correct ascending order
   */
  const checkCorrectOrder = useCallback(() => {
    if (!surahs.length) return false;
    
    // Check if each surah has a higher number than the previous one
    return surahs.every((surah, index, array) => 
      index === 0 || surah.number > array[index - 1].number
    );
  }, [surahs]);
  
  /**
   * Initialize with the provided surahs
   */
  const initializeSurahs = useCallback((provided: Surah[]) => {
    const shuffled = shuffleSurahs(provided);
    setSurahs(shuffled);
  }, [shuffleSurahs]);
  
  // Initialize when data is available
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