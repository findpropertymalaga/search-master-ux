
import { useState, useEffect, useRef } from 'react';
import { Property } from '@/components/property/types';
import { fetchResaleProperties, fetchAllResaleProperties as fetchAllResalePropertiesService } from '@/services/resalePropertyService';
import { FilterValues } from '@/components/SearchFilters';
import { useToast } from "@/hooks/use-toast";

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

interface FetchResalePropertiesState {
  properties: Property[];
  allProperties: Property[];
  loading: boolean;
  page: number;
  totalCount: number;
  error: string | null;
}

interface FetchResalePropertiesOptions {
  currentFilters: FilterValues;
  sortOrder: SortOption;
  isInitialized: boolean;
  ITEMS_PER_PAGE: number;
  initialPage?: number;
}

export const useFetchResaleProperties = (options: FetchResalePropertiesOptions) => {
  const { currentFilters, sortOrder, isInitialized, ITEMS_PER_PAGE, initialPage = 1 } = options;
  const [state, setState] = useState<FetchResalePropertiesState>({
    properties: [],
    allProperties: [],
    loading: false,
    page: initialPage,
    totalCount: 0,
    error: null
  });
  
  const { toast } = useToast();
  
  // Simplified refs
  const abortController = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const lastFetchParamsRef = useRef<string>('');
  const isLoadingRef = useRef(false);
  
  // Function to fetch all resale properties for map (without pagination)
  const fetchAllResaleProperties = async (filters: FilterValues, sort: SortOption) => {
    try {
      console.log("Fetching ALL resale properties for map view");
      // Use the actual fetchAllResalePropertiesService function instead of paginated fetchResaleProperties
      const allFetchedProperties = await fetchAllResalePropertiesService(filters, sort);
      
      console.log(`Fetched ${allFetchedProperties.length} total resale properties for map`);
      return allFetchedProperties;
    } catch (error) {
      console.error("Error fetching all resale properties:", error);
      return [];
    }
  };
  
  const loadResaleProperties = async (pageNumber = 1) => {
    try {
      if (!isInitialized || isLoadingRef.current) {
        return;
      }
      
      // Create a unique identifier for this request
      const requestParams = JSON.stringify({ filters: currentFilters, sortOrder, page: pageNumber });
      
      // Skip if this is the exact same request as the last one
      if (requestParams === lastFetchParamsRef.current) {
        console.log("Skipping duplicate resale properties request");
        return;
      }
      
      isLoadingRef.current = true;
      lastFetchParamsRef.current = requestParams;
      
      // Cancel any existing request
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();
      
      setState(prev => ({
        ...prev,
        loading: true,
        error: null
      }));
      
      console.log(`Fetching resale properties - Page: ${pageNumber}`);
      
      // Fetch current page properties
      const { properties: fetchedProperties, totalCount, hasMore } = await fetchResaleProperties(
        currentFilters,
        pageNumber,
        ITEMS_PER_PAGE,
        sortOrder
      );
      
      if (!isMountedRef.current) return;
      
      console.log(`Fetched ${fetchedProperties.length} resale properties for page ${pageNumber}, total: ${totalCount}`);
      
      // Also fetch all properties for map - always needed regardless of page
      let allPropertiesForMap: Property[] = [];
      const currentAllProperties = state.allProperties;
      if (pageNumber === 1 || !currentAllProperties || currentAllProperties.length === 0) {
        console.log("Fetching all properties for map...");
        allPropertiesForMap = await fetchAllResaleProperties(currentFilters, sortOrder);
      }
      
      setState(prev => ({
        ...prev,
        properties: fetchedProperties,
        allProperties: allPropertiesForMap.length > 0 ? allPropertiesForMap : prev.allProperties,
        totalCount: totalCount || 0,
        loading: false,
        page: pageNumber
      }));
      
    } catch (error: any) {
      console.error("Error fetching resale properties:", error);
      if (error.name !== 'AbortError' && isMountedRef.current) {
        setState(prev => ({
          ...prev,
          error: "Failed to load resale properties. Please try again.",
          loading: false
        }));
        
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load resale properties after 5 seconds.",
        });
      }
    } finally {
      isLoadingRef.current = false;
    }
  };

  // Auto-trigger initial load when initialized
  useEffect(() => {
    if (isInitialized && isMountedRef.current) {
      console.log('Auto-triggering initial resale properties load for page:', state.page);
      loadResaleProperties(state.page);
    }
  }, [isInitialized]);

  return {
    state,
    setState,
    loadResaleProperties,
    refs: {
      abortController,
      isMountedRef,
      isLoadingRef
    }
  };
};
