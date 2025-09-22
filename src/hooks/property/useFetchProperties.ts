
import { useState, useEffect, useRef } from 'react';
import { Property } from '@/components/property/types';
import { fetchProperties, fetchAllProperties as fetchAllPropertiesService } from '@/services/propertyService';
import { FilterValues } from '@/components/SearchFilters';
import { useToast } from "@/hooks/use-toast";

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

interface FetchPropertiesState {
  properties: Property[];
  allProperties: Property[];
  loading: boolean;
  loadingMore: boolean;
  page: number;
  hasMore: boolean;
  totalCount: number;
  error: string | null;
}

interface FetchPropertiesOptions {
  currentFilters: FilterValues;
  sortOrder: SortOption;
  isInitialized: boolean;
  ITEMS_PER_PAGE: number;
}

export const useFetchProperties = (options: FetchPropertiesOptions) => {
  const { currentFilters, sortOrder, isInitialized, ITEMS_PER_PAGE } = options;
  const [state, setState] = useState<FetchPropertiesState>({
    properties: [],
    allProperties: [],
    loading: true,
    loadingMore: false,
    page: 1,
    hasMore: true,
    totalCount: 0,
    error: null
  });
  
  const { toast } = useToast();
  
  // Simplified refs
  const abortController = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const lastFetchParamsRef = useRef<string>('');
  const isLoadingRef = useRef(false);
  
  // Function to fetch all properties for map (without pagination)
  const fetchAllProperties = async (filters: FilterValues, sort: SortOption) => {
    try {
      console.log("Fetching ALL properties for map view");
      // Use the actual fetchAllProperties service function instead of paginated fetchProperties
      const allFetchedProperties = await fetchAllPropertiesService(filters, sort);
      
      console.log(`Fetched ${allFetchedProperties.length} total properties for map`);
      return allFetchedProperties;
    } catch (error) {
      console.error("Error fetching all properties:", error);
      return [];
    }
  };
  
  const loadProperties = async (pageNumber = 1, isLoadMore = false) => {
    try {
      if (!isInitialized || isLoadingRef.current) {
        return;
      }
      
      // Create a unique identifier for this request
      const requestParams = JSON.stringify({ filters: currentFilters, sortOrder, page: pageNumber });
      
      // Skip if this is the exact same request as the last one
      if (!isLoadMore && requestParams === lastFetchParamsRef.current) {
        console.log("Skipping duplicate request");
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
        loading: !isLoadMore,
        loadingMore: isLoadMore,
        error: null
      }));
      
      console.log(`Fetching properties - Page: ${pageNumber}, LoadMore: ${isLoadMore}`);
      
      // Fetch current page properties
      const { properties: fetchedProperties, totalCount, hasMore } = await fetchProperties(
        currentFilters,
        pageNumber,
        ITEMS_PER_PAGE,
        sortOrder
      );
      
      if (!isMountedRef.current) return;
      
      console.log(`Fetched ${fetchedProperties.length} properties for page ${pageNumber}, total: ${totalCount}`);
      
      // For new searches (not load more), also fetch all properties for map
      let allPropertiesForMap: Property[] = [];
      if (!isLoadMore) {
        allPropertiesForMap = await fetchAllProperties(currentFilters, sortOrder);
      }
      
      // Helper function to deduplicate properties by property_id
      const deduplicateProperties = (properties: Property[]): Property[] => {
        const seen = new Set<string>();
        return properties.filter(property => {
          if (seen.has(property.id)) {
            return false;
          }
          seen.add(property.id);
          return true;
        });
      };

      setState(prev => {
        if (isLoadMore) {
          // Deduplicate when loading more to prevent duplicates
          const combinedProperties = [...prev.properties, ...fetchedProperties];
          const updatedProperties = deduplicateProperties(combinedProperties);
          return {
            ...prev,
            properties: updatedProperties,
            allProperties: updatedProperties,
            totalCount: totalCount || 0,
            hasMore: hasMore,
            loading: false,
            loadingMore: false,
            page: pageNumber
          };
        } else {
          // Deduplicate for new searches as well
          const deduplicatedProperties = deduplicateProperties(fetchedProperties);
          const deduplicatedAllProperties = allPropertiesForMap.length > 0 
            ? deduplicateProperties(allPropertiesForMap) 
            : deduplicatedProperties;
          
          return {
            ...prev,
            properties: deduplicatedProperties,
            allProperties: deduplicatedAllProperties,
            totalCount: totalCount || 0,
            hasMore: hasMore,
            loading: false,
            loadingMore: false,
            page: pageNumber
          };
        }
      });
      
    } catch (error: any) {
      console.error("Error fetching properties:", error);
      if (error.name !== 'AbortError' && isMountedRef.current) {
        setState(prev => ({
          ...prev,
          error: "Failed to load properties. Please try again.",
          loading: false,
          loadingMore: false
        }));
        
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load properties after 5 seconds.",
        });
      }
    } finally {
      isLoadingRef.current = false;
    }
  };

  return {
    state,
    setState,
    loadProperties,
    refs: {
      abortController,
      isMountedRef,
      isLoadingRef
    }
  };
};
