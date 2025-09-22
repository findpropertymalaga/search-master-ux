import { useState, useEffect, useRef } from 'react';
import { FilterValues } from '@/components/SearchFilters';
import { Property } from '@/components/property/types';
import { useFetchRentalProperties } from '@/hooks/property/useFetchRentalProperties';
import { useIsMobile } from '@/hooks/use-mobile';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

export const useRentalPropertyData = (currentFilters: FilterValues, isInitialized = true) => {
  console.log('🚀 useRentalPropertyData CALLED with:', { currentFilters, isInitialized });
  
  // For rental properties, we don't need to wait for session storage restoration
  // So we'll manage our own initialization state
  const [rentalInitialized, setRentalInitialized] = useState(false);
  
  const ITEMS_PER_PAGE = 30;
  const isMobile = useIsMobile();
  
  const [sortOrder, setSortOrder] = useState<SortOption>(() => {
    // Restore sort order from sessionStorage for rental properties
    const savedSort = sessionStorage.getItem('rentalPropertySortOrder');
    return (savedSort as SortOption) || 'published';
  });
  
  // Initialize page from saved navigation state
  const [initialPage] = useState(() => {
    const savedNavigation = sessionStorage.getItem('scrollMemory_rent');
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
  
  // Use the fetch hook - use rental-specific initialization
  const { state, loadRentalProperties: loadProperties, refs } = useFetchRentalProperties({
    currentFilters,
    sortOrder,
    isInitialized: rentalInitialized && mobileInitialized && detectedMobile !== null,
    ITEMS_PER_PAGE,
    initialPage
  });
  
  // Set rental initialized immediately after mobile detection
  useEffect(() => {
    if (mobileInitialized && detectedMobile !== null && !rentalInitialized) {
      console.log('🎯 Setting rental initialized to true');
      setRentalInitialized(true);
    }
  }, [mobileInitialized, detectedMobile, rentalInitialized]);
  
  // Log initialization state
  useEffect(() => {
    console.log('=== useRentalPropertyData: Initialization state ===');
    console.log('Original isInitialized:', isInitialized, 'rentalInitialized:', rentalInitialized, 'mobileInitialized:', mobileInitialized, 'detectedMobile:', detectedMobile);
    console.log('Combined initialized:', rentalInitialized && mobileInitialized && detectedMobile !== null);
  }, [isInitialized, rentalInitialized, mobileInitialized, detectedMobile]);
  
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
  
  // Force initial load for rental properties when conditions are met
  useEffect(() => {
    if (rentalInitialized && mobileInitialized && detectedMobile !== null && lastFiltersRef.current === '') {
      console.log('=== FORCING INITIAL RENTAL PROPERTIES LOAD ===');
      console.log('Initial filters:', currentFilters);
      lastFiltersRef.current = JSON.stringify({ ...currentFilters, sortOrder });
      
      const timeoutId = setTimeout(() => {
        if (refs.isMountedRef.current) {
          console.log('=== EXECUTING INITIAL RENTAL PROPERTIES LOAD ===');
          loadProperties(1);
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [rentalInitialized, mobileInitialized, detectedMobile, currentFilters, sortOrder, loadProperties]);
  // Handle filter changes with debouncing
  useEffect(() => {
    const filtersString = JSON.stringify({ ...currentFilters, sortOrder });
    
    console.log('=== useRentalPropertyData: Filter change effect ===');
    console.log('rentalInitialized:', rentalInitialized);
    console.log('mobileInitialized:', mobileInitialized); 
    console.log('detectedMobile:', detectedMobile);
    console.log('Current filters string:', filtersString);
    console.log('Last filters string:', lastFiltersRef.current);
    console.log('Strings are different:', filtersString !== lastFiltersRef.current);
    console.log('All conditions met:', rentalInitialized && mobileInitialized && detectedMobile !== null && filtersString !== lastFiltersRef.current);
    
    if (rentalInitialized && mobileInitialized && detectedMobile !== null && filtersString !== lastFiltersRef.current) {
      lastFiltersRef.current = filtersString;
      initializationAttempts.current++;
      
      console.log('=== RENTAL FILTER CHANGE DETECTED ===');
      console.log('New filters:', currentFilters);
      console.log('Sort order:', sortOrder);
      console.log('Initialization attempt:', initializationAttempts.current);
      
      // Longer debounce for mobile
      const debounceTime = detectedMobile ? 200 : 100;
      const timeoutId = setTimeout(() => {
        if (refs.isMountedRef.current) {
          console.log('=== LOADING RENTAL PROPERTIES WITH NEW FILTERS ===');
          loadProperties(1);
        } else {
          console.log('Component unmounted before loading rental properties');
        }
      }, debounceTime);
      
      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      console.log('Rental filter change skipped - conditions not met');
      console.log('Missing conditions:');
      console.log('- rentalInitialized:', rentalInitialized);
      console.log('- mobileInitialized:', mobileInitialized);
      console.log('- detectedMobile !== null:', detectedMobile !== null);
      console.log('- filters changed:', filtersString !== lastFiltersRef.current);
    }
  }, [currentFilters, sortOrder, rentalInitialized, mobileInitialized, detectedMobile, loadProperties]);
  
  // Actions
  const handleSortChange = (newSortOrder: SortOption) => {
    console.log('=== RENTAL SORT ORDER CHANGE ===');
    console.log('Old sort order:', sortOrder);
    console.log('New sort order:', newSortOrder);
    setSortOrder(newSortOrder);
    // Persist sort order to sessionStorage
    sessionStorage.setItem('rentalPropertySortOrder', newSortOrder);
  };
  
  const handlePageChange = (page: number) => {
    console.log('=== RENTAL PAGE CHANGE ===');
    console.log('Current page:', state.page);
    console.log('New page:', page);
    loadProperties(page);
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
    mobileInitialized,
    detectedMobile // Expose for debugging
  };
};