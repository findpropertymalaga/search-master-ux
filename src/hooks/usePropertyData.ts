
import { useState, useEffect, useRef } from 'react';
import { FilterValues } from '@/components/SearchFilters';
import { Property } from '@/components/property/types';
import { useFetchResaleProperties } from '@/hooks/property/useFetchResaleProperties';
import { usePropertyActions } from '@/hooks/property/usePropertyActions';
import { usePropertyCleanup } from '@/hooks/property/usePropertyCleanup';
import { useIsMobile } from '@/hooks/use-mobile';
import { debugDatabaseConnection } from '@/utils/debugDatabase';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

export const usePropertyData = (currentFilters: FilterValues, isInitialized = true) => {
  const ITEMS_PER_PAGE = 30;
  const isMobile = useIsMobile();
  
  const [sortOrder, setSortOrder] = useState<SortOption>(() => {
    // Restore sort order from sessionStorage for buy properties
    const savedSort = sessionStorage.getItem('buyPropertySortOrder');
    return (savedSort as SortOption) || 'published';
  });
  
  // Initialize page from saved navigation state
  const [initialPage] = useState(() => {
    const savedNavigation = sessionStorage.getItem('scrollMemory_buy');
    if (savedNavigation) {
      try {
        const navData = JSON.parse(savedNavigation);
        return navData.currentPage || 1;
      } catch {
        return 1;
      }
    }
    return 1;
  });
  const [mobileInitialized, setMobileInitialized] = useState(false);
  const [detectedMobile, setDetectedMobile] = useState<boolean | null>(null);
  const lastFiltersRef = useRef<string>('');
  const initializationAttempts = useRef(0);
  
  // Debug database connection on first load
  useEffect(() => {
    if (isInitialized) {
      console.log('=== INITIALIZING PROPERTY DATA HOOK ===');
      console.log('Running database debug check...');
      debugDatabaseConnection();
    }
  }, [isInitialized]);
  
  // Detect mobile immediately using user agent as fallback
  useEffect(() => {
    const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Use user agent detection as primary, useIsMobile as secondary
    const actuallyMobile = userAgentMobile;
    setDetectedMobile(actuallyMobile);
    
    if (!actuallyMobile) {
      // Desktop - initialize immediately
      setMobileInitialized(true);
    }
  }, [isMobile]);
  
  // Use the fetch hook - only initialize when mobile detection is complete
  const { state, loadResaleProperties: loadProperties, refs } = useFetchResaleProperties({
    currentFilters,
    sortOrder,
    isInitialized: isInitialized && mobileInitialized && detectedMobile !== null,
    ITEMS_PER_PAGE,
    initialPage
  });
  
  // Mobile-specific initialization delay
  useEffect(() => {
    if (detectedMobile === true && !mobileInitialized) {
      // Add a 200ms delay specifically for mobile browsers
      const initDelay = setTimeout(() => {
        setMobileInitialized(true);
      }, 200);
      
      return () => clearTimeout(initDelay);
    }
  }, [detectedMobile, mobileInitialized]);
  
  // Handle filter changes with debouncing
  useEffect(() => {
    const filtersString = JSON.stringify({ ...currentFilters, sortOrder });
    
    if (isInitialized && mobileInitialized && detectedMobile !== null && filtersString !== lastFiltersRef.current) {
      lastFiltersRef.current = filtersString;
      initializationAttempts.current++;
      
      console.log('=== FILTER CHANGE DETECTED ===');
      console.log('New filters:', currentFilters);
      console.log('Sort order:', sortOrder);
      console.log('Initialization attempt:', initializationAttempts.current);
      
      // Longer debounce for mobile
      const debounceTime = detectedMobile ? 200 : 100;
      const timeoutId = setTimeout(() => {
        if (refs.isMountedRef.current) {
          console.log('=== LOADING PROPERTIES WITH NEW FILTERS ===');
          loadProperties(1);
        }
      }, debounceTime);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [currentFilters, sortOrder, isInitialized, mobileInitialized, detectedMobile, loadProperties]);
  
  // Actions
  const handleSortChange = (newSortOrder: SortOption) => {
    console.log('=== SORT ORDER CHANGE ===');
    console.log('Old sort order:', sortOrder);
    console.log('New sort order:', newSortOrder);
    setSortOrder(newSortOrder);
    // Persist sort order to sessionStorage
    sessionStorage.setItem('buyPropertySortOrder', newSortOrder);
  };
  
  const handlePageChange = (page: number) => {
    console.log('=== CHANGING PAGE ===');
    console.log('Current page:', state.page);
    console.log('New page:', page);
    loadProperties(page);
  };
  
  // Cleanup
  useEffect(() => {
    return () => {
      refs.isMountedRef.current = false;
      if (refs.abortController.current) {
        refs.abortController.current.abort();
      }
    };
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(state.totalCount / ITEMS_PER_PAGE);

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
    mobileInitialized,
    detectedMobile // Expose for debugging
  };
};
