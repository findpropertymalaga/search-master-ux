import { useState, useRef, useCallback, useEffect } from 'react';
import { FilterValues } from '@/components/SearchFilters';
import { Property } from '@/components/property/types';
import { fetchRentalProperties, fetchAllRentalProperties } from '@/services/rentalPropertyService';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

interface FetchRentalPropertiesParams {
  currentFilters: FilterValues;
  sortOrder: SortOption;
  isInitialized: boolean;
  ITEMS_PER_PAGE: number;
  initialPage?: number;
}

interface FetchRentalPropertiesState {
  properties: Property[];
  allProperties: Property[];
  loading: boolean;
  page: number;
  totalCount: number;
  error: string | null;
}

export const useFetchRentalProperties = ({
  currentFilters,
  sortOrder,
  isInitialized,
  ITEMS_PER_PAGE,
  initialPage = 1
}: FetchRentalPropertiesParams) => {
  
  const [state, setState] = useState<FetchRentalPropertiesState>({
    properties: [],
    allProperties: [],
    loading: false,
    page: initialPage,
    totalCount: 0,
    error: null
  });

  const isMountedRef = useRef(true);
  const abortController = useRef<AbortController | null>(null);

  const loadRentalProperties = useCallback(async (page: number) => {
    console.log('=== loadRentalProperties called ===');
    console.log('isInitialized:', isInitialized, 'page:', page);
    
    if (!isInitialized) {
      console.log('Rental properties fetch skipped - not initialized');
      return;
    }

    console.log('=== Starting rental properties fetch ===');

    // Abort any ongoing request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('=== FETCHING RENTAL PROPERTIES ===');
      console.log('Page:', page);
      console.log('Filters:', currentFilters);

      // Fetch paginated properties and all properties in parallel (only on page 1)
      const paginatedResult = await fetchRentalProperties(currentFilters, page, ITEMS_PER_PAGE, sortOrder);
      let allPropertiesArray: Property[] = [];
      
      // Always fetch all properties for map if we don't have them yet
      const currentAllProperties = state.allProperties;
      if (page === 1 || !currentAllProperties || currentAllProperties.length === 0) {
        console.log("Fetching all rental properties for map...");
        allPropertiesArray = await fetchAllRentalProperties(currentFilters, sortOrder);
      }

      if (!isMountedRef.current) return;

      const { properties: newProperties, totalCount } = paginatedResult;

      setState(prev => ({
        ...prev,
        properties: newProperties,
        allProperties: allPropertiesArray.length > 0 ? allPropertiesArray : prev.allProperties,
        loading: false,
        page,
        totalCount,
        error: null
      }));

      console.log('=== RENTAL PROPERTIES LOADED SUCCESSFULLY ===');
      console.log('New properties:', newProperties.length);
      console.log('Total count:', totalCount);

    } catch (error) {
      console.error('Error loading rental properties:', error);
      
      if (!isMountedRef.current) return;
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load rental properties'
      }));
    }
  }, [currentFilters, sortOrder, isInitialized, ITEMS_PER_PAGE]);

  // Auto-trigger initial load when initialized
  useEffect(() => {
    if (isInitialized && isMountedRef.current) {
      console.log('Auto-triggering initial rental properties load for page:', state.page);
      loadRentalProperties(state.page);
    }
  }, [isInitialized]);

  return {
    state,
    loadRentalProperties,
    refs: { isMountedRef, abortController }
  };
};