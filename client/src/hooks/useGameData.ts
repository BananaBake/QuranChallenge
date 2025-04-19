import { useState, useCallback } from 'react';
import { useRandomAyahsForGame, useRandomSurahsForGame } from '@/hooks/useQuranData';
import { useToast } from '@/hooks/use-toast';
import { Ayah, Surah } from '@shared/schema';

/**
 * Hook for loading and managing Identify Surah game data
 */
export function useIdentifySurahData() {
  const { data: ayahs, isLoading, refetch } = useRandomAyahsForGame(5);
  const { toast } = useToast();
  
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [options, setOptions] = useState<Array<{ name: string, arabicName: string, number: number }>>([]);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  
  /**
   * Generate options for the current ayah
   */
  const generateOptionsForAyah = useCallback((ayah: Ayah, surahs: Surah[]) => {
    if (!ayah || !surahs.length) return [];
    
    // Get all available surahs excluding the correct one
    const availableSurahs = surahs.filter(s => s.number !== ayah.surah.number);
    
    // Get 3 random incorrect options
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
  const loadNextQuestion = useCallback(async (allSurahs: Surah[]) => {
    setIsLoadingNext(true);
    try {
      // Fetch a new random ayah
      const response = await fetch('/api/quran/random-ayahs?count=1');
      const data = await response.json();
      
      if (data && data.length > 0) {
        setCurrentAyah(data[0]);
        
        // Generate options
        const newOptions = generateOptionsForAyah(data[0], allSurahs);
        setOptions(newOptions);
        
        return data[0];
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch next question:", error);
      toast({
        title: "Error",
        description: "Failed to fetch the next question. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoadingNext(false);
    }
  }, [generateOptionsForAyah, toast]);
  
  /**
   * Initialize the first question
   */
  const initializeQuestion = useCallback((ayah: Ayah, surahs: Surah[]) => {
    setCurrentAyah(ayah);
    const newOptions = generateOptionsForAyah(ayah, surahs);
    setOptions(newOptions);
  }, [generateOptionsForAyah]);
  
  return {
    ayahs,
    isLoading,
    currentAyah,
    options,
    isLoadingNext,
    initializeQuestion,
    loadNextQuestion,
    generateOptionsForAyah
  };
}

/**
 * Hook for loading and managing Surah Ordering game data
 */
export function useSurahOrderingData() {
  const { data: originalSurahs, isLoading, refetch } = useRandomSurahsForGame(5);
  const { toast } = useToast();
  
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  
  /**
   * Shuffle surahs into random order
   */
  const shuffleSurahs = useCallback((surahList: Surah[]) => {
    if (!surahList || surahList.length === 0) return [];
    return [...surahList].sort(() => Math.random() - 0.5);
  }, []);
  
  /**
   * Load the next set of surahs
   */
  const loadNextQuestion = useCallback(async () => {
    setIsLoadingNext(true);
    try {
      // Fetch new random surahs
      const response = await fetch('/api/quran/random-surahs?count=5');
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Shuffle the order for the game
        const shuffled = shuffleSurahs(data);
        setSurahs(shuffled);
        return shuffled;
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch next question:", error);
      toast({
        title: "Error",
        description: "Failed to fetch the next question. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoadingNext(false);
    }
  }, [shuffleSurahs, toast]);
  
  /**
   * Handle moving surahs during ordering
   */
  const handleMoveSurah = useCallback((dragIndex: number, hoverIndex: number) => {
    if (!surahs.length) return;
    
    const dragItem = surahs[dragIndex];
    const newItems = [...surahs];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    setSurahs(newItems);
  }, [surahs]);
  
  /**
   * Check if the surahs are in correct ascending order
   */
  const checkCorrectOrder = useCallback(() => {
    if (!surahs.length) return false;
    
    return [...surahs].every((surah, index, array) => 
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
  
  return {
    originalSurahs,
    surahs,
    isLoading,
    isLoadingNext,
    initializeSurahs,
    loadNextQuestion,
    handleMoveSurah,
    checkCorrectOrder
  };
}