
import { useEffect, MutableRefObject } from 'react';
import { FilterValues } from '@/components/SearchFilters';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

interface PropertyEffectsProps {
  currentFilters: FilterValues;
  sortOrder: SortOption;
  isInitialized: boolean;
  loadProperties: (pageNumber?: number, isLoadMore?: boolean) => Promise<void>;
  abortController: MutableRefObject<AbortController | null>;
}

export const usePropertyEffects = ({
  currentFilters,
  sortOrder,
  isInitialized,
  loadProperties,
  abortController
}: PropertyEffectsProps) => {
  // Simplified effect with minimal dependencies
  useEffect(() => {
    if (!isInitialized) return;
    
    const timeoutId = setTimeout(() => {
      loadProperties(1, false);
    }, 50);
    
    return () => {
      clearTimeout(timeoutId);
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [JSON.stringify(currentFilters), sortOrder, isInitialized]);
};
