import { useState, useEffect, useRef, useCallback } from 'react';
import { FilterValues } from '@/components/SearchFilters';
import { Property } from '@/components/property/types';
import { useFetchResaleProperties } from '@/hooks/property/useFetchResaleProperties';
import { useFetchRentalProperties } from '@/hooks/property/useFetchRentalProperties';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';
type PropertyType = 'resale' | 'rental';

interface UseOptimizedPropertyDataOptions {
  currentFilters: FilterValues;
  isInitialized: boolean;
  propertyType: PropertyType;
}

export const useOptimizedPropertyData = ({ 
  currentFilters, 
  isInitialized, 
  propertyType 
}: UseOptimizedPropertyDataOptions) => {
  const ITEMS_PER_PAGE = 30;
  
  // Simplified mobile detection - no delays, just check once
  const [isMobile] = useState(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  });
  
  // Unified sort order management
  const [sortOrder, setSortOrder] = useState<SortOption>(() => {
    const storageKey = propertyType === 'rental' ? 'rentalPropertySortOrder' : 'buyPropertySortOrder';
    const savedSort = sessionStorage.getItem(storageKey);
    return (savedSort as SortOption) || 'published';
  });

  // Single initialization state - no complex coordination needed
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  
  // Use appropriate fetch hook based on property type
  const resaleHook = useFetchResaleProperties({
    currentFilters,
    sortOrder,
    isInitialized: isDataInitialized && propertyType === 'resale',
    ITEMS_PER_PAGE
  });
  
  const rentalHook = useFetchRentalProperties({
    currentFilters,
    sortOrder,
    isInitialized: isDataInitialized && propertyType === 'rental',
    ITEMS_PER_PAGE
  });
  
  // Select the appropriate hook and function based on property type
  const { state, refs, loadProperties } = propertyType === 'resale' 
    ? { 
        state: resaleHook.state, 
        refs: resaleHook.refs, 
        loadProperties: resaleHook.loadResaleProperties 
      }
    : { 
        state: rentalHook.state, 
        refs: rentalHook.refs, 
        loadProperties: rentalHook.loadRentalProperties 
      };
  
  const lastFiltersRef = useRef<string>('');
  
  // Initialize immediately when parent is ready - no artificial delays
  useEffect(() => {
    if (isInitialized && !isDataInitialized) {
      console.log(`🚀 Initializing ${propertyType} properties data - FAST MODE`);
      setIsDataInitialized(true);
    }
  }, [isInitialized, isDataInitialized, propertyType]);
  
  // Optimized filter change handling with minimal debounce
  useEffect(() => {
    const filtersString = JSON.stringify({ ...currentFilters, sortOrder });
    
    if (isDataInitialized && filtersString !== lastFiltersRef.current) {
      lastFiltersRef.current = filtersString;
      
      console.log(`=== ${propertyType.toUpperCase()} FILTER CHANGE - OPTIMIZED ===`);
      
      // Minimal debounce - only 50ms to batch rapid changes
      const timeoutId = setTimeout(() => {
        if (refs.isMountedRef.current && loadProperties) {
          console.log(`=== LOADING ${propertyType.toUpperCase()} PROPERTIES ===`);
          loadProperties(1);
        }
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentFilters, sortOrder, isDataInitialized, propertyType, loadProperties]);
  
  // Optimized sort change handler
  const handleSortChange = useCallback((newSortOrder: SortOption) => {
    console.log(`=== ${propertyType.toUpperCase()} SORT CHANGE ===`, newSortOrder);
    setSortOrder(newSortOrder);
    
    // Persist to appropriate storage key
    const storageKey = propertyType === 'rental' ? 'rentalPropertySortOrder' : 'buyPropertySortOrder';
    sessionStorage.setItem(storageKey, newSortOrder);
  }, [propertyType]);
  
  // Page change handler
  const handlePageChange = (page: number) => {
    if (loadProperties) {
      console.log(`=== CHANGING PAGE ${propertyType.toUpperCase()} PROPERTIES ===`, page);
      loadProperties(page);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(state.totalCount / ITEMS_PER_PAGE);
  
  // Cleanup
  useEffect(() => {
    return () => {
      refs.isMountedRef.current = false;
      if (refs.abortController.current) {
        refs.abortController.current.abort();
      }
    };
  }, []);

  return {
    properties: state.properties,
    allProperties: state.allProperties,
    loading: state.loading,
    page: state.page,
    totalPages,
    totalCount: state.totalCount,
    sortOrder,
    handleSortChange,
    handlePageChange,
    error: state.error,
    isMobile,
    isInitializing: !isDataInitialized
  };
};