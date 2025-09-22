import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FilterValues } from '@/components/SearchFilters';
import { buildPropertyQuery } from '@/utils/propertyQueryBuilder';
import { buildRentalPropertyQuery } from '@/utils/rentalPropertyQueryBuilder';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

interface EnhancedPropertyNavigation {
  previousPropertyId: string | null;
  nextPropertyId: string | null;
  currentIndex: number;
  totalProperties: number;
  loading: boolean;
}

interface StoredSearchContext {
  filters: FilterValues;
  sortOrder: SortOption;
  isRental: boolean;
  totalCount: number;
}

export const useEnhancedPropertyNavigation = (currentPropertyId: string, isRental?: boolean): EnhancedPropertyNavigation => {
  const [navigation, setNavigation] = useState<EnhancedPropertyNavigation>({
    previousPropertyId: null,
    nextPropertyId: null,
    currentIndex: -1,
    totalProperties: 0,
    loading: true
  });

  useEffect(() => {
    if (!currentPropertyId) return;

    const findPropertyNavigation = async () => {
      try {
        // Get stored search context
        const searchContext = getStoredSearchContext(isRental);
        if (!searchContext) {
          console.log('No search context found, falling back to basic navigation');
          setNavigation({
            previousPropertyId: null,
            nextPropertyId: null,
            currentIndex: -1,
            totalProperties: 0,
            loading: false
          });
          return;
        }

        console.log('Found search context:', searchContext);

        // First, find the current property's position in the sorted results
        const currentIndex = await findPropertyPosition(
          currentPropertyId, 
          searchContext.filters, 
          searchContext.sortOrder,
          searchContext.isRental
        );

        if (currentIndex === -1) {
          console.log('Current property not found in search results');
          setNavigation({
            previousPropertyId: null,
            nextPropertyId: null,
            currentIndex: -1,
            totalProperties: searchContext.totalCount,
            loading: false
          });
          return;
        }

        console.log(`Current property found at index ${currentIndex} of ${searchContext.totalCount}`);

        // Get previous and next property IDs
        const [previousPropertyId, nextPropertyId] = await Promise.all([
          currentIndex > 0 ? getPropertyIdAtIndex(
            currentIndex - 1, 
            searchContext.filters, 
            searchContext.sortOrder,
            searchContext.isRental
          ) : Promise.resolve(null),
          currentIndex < searchContext.totalCount - 1 ? getPropertyIdAtIndex(
            currentIndex + 1, 
            searchContext.filters, 
            searchContext.sortOrder,
            searchContext.isRental
          ) : Promise.resolve(null)
        ]);

        console.log('Navigation calculated:', { previousPropertyId, nextPropertyId, currentIndex, totalProperties: searchContext.totalCount });

        setNavigation({
          previousPropertyId,
          nextPropertyId,
          currentIndex,
          totalProperties: searchContext.totalCount,
          loading: false
        });

      } catch (error) {
        console.error('Error finding property navigation:', error);
        setNavigation({
          previousPropertyId: null,
          nextPropertyId: null,
          currentIndex: -1,
          totalProperties: 0,
          loading: false
        });
      }
    };

    findPropertyNavigation();
  }, [currentPropertyId, isRental]);

  return navigation;
};

// Helper function to get stored search context
const getStoredSearchContext = (isRental?: boolean): StoredSearchContext | null => {
  try {
    // Try to get from current URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const isRentalFromUrl = window.location.pathname.includes('/rent');
    
    // Use passed isRental parameter if available, otherwise fall back to URL detection
    const actuallyRental = isRental !== undefined ? isRental : isRentalFromUrl;
    
    // Get from current session storage - try both contexts if isRental not explicitly passed
    let storedContext: string | null = null;
    if (isRental !== undefined) {
      // Explicit rental flag provided - use the correct context
      const currentSearchKey = actuallyRental ? 'rentalSearchContext' : 'searchContext';
      storedContext = sessionStorage.getItem(currentSearchKey);
    } else {
      // No explicit flag - try both contexts, preferring URL-based detection
      const primaryKey = isRentalFromUrl ? 'rentalSearchContext' : 'searchContext';
      const fallbackKey = isRentalFromUrl ? 'searchContext' : 'rentalSearchContext';
      storedContext = sessionStorage.getItem(primaryKey) || sessionStorage.getItem(fallbackKey);
    }
    
    if (storedContext) {
      return JSON.parse(storedContext);
    }

    // Fallback: try to reconstruct from URL parameters
    const filters: FilterValues = {
      location: urlParams.get('location') || '',
      type: urlParams.get('type') || 'any',
      minPrice: parseInt(urlParams.get('minPrice') || '0'),
      maxPrice: parseInt(urlParams.get('maxPrice') || '5000000'),
      bedrooms: urlParams.get('bedrooms') || 'any',
      bathrooms: urlParams.get('bathrooms') || 'any',
      has_pool: urlParams.get('pool') === 'true',
      has_garden: urlParams.get('garden') === 'true',
      has_garage: urlParams.get('garage') === 'true'
    };

    const sortOrder = (urlParams.get('sort') as SortOption) || 'published';

    // We can't get total count from URL, so we'll need to fetch it
    return {
      filters,
      sortOrder,
      isRental: actuallyRental,
      totalCount: 0 // Will be updated when we query
    };

  } catch (error) {
    console.error('Error getting stored search context:', error);
    return null;
  }
};

// Helper function to find a property's position in sorted results
const findPropertyPosition = async (
  propertyId: string, 
  filters: FilterValues, 
  sortOrder: SortOption,
  isRental: boolean
): Promise<number> => {
  try {
    console.log(`Finding position for property ${propertyId} in ${isRental ? 'rental' : 'resale'} results`);

    let query;
    if (isRental) {
      query = buildRentalPropertyQuery(filters, sortOrder);
    } else {
      query = buildPropertyQuery(filters, sortOrder);
    }

    // We need to get all property IDs in order to find the position
    // This is expensive but necessary for accurate navigation
    const { data, error } = await query.select('property_id');

    if (error) {
      console.error('Error finding property position:', error);
      return -1;
    }

    if (!data) return -1;

    const index = data.findIndex(row => row.property_id === propertyId);
    console.log(`Property ${propertyId} found at index: ${index}`);
    return index;

  } catch (error) {
    console.error('Error finding property position:', error);
    return -1;
  }
};

// Helper function to get property ID at a specific index
const getPropertyIdAtIndex = async (
  index: number, 
  filters: FilterValues, 
  sortOrder: SortOption,
  isRental: boolean
): Promise<string | null> => {
  try {
    console.log(`Getting property ID at index ${index} for ${isRental ? 'rental' : 'resale'} results`);

    let query;
    if (isRental) {
      query = buildRentalPropertyQuery(filters, sortOrder);
    } else {
      query = buildPropertyQuery(filters, sortOrder);
    }

    const { data, error } = await query
      .select('property_id')
      .range(index, index)
      .single();

    if (error) {
      console.error('Error getting property at index:', error);
      return null;
    }

    return data?.property_id || null;

  } catch (error) {
    console.error('Error getting property at index:', error);
    return null;
  }
};

// Helper function to store search context for navigation
export const storeSearchContext = (
  filters: FilterValues, 
  sortOrder: SortOption, 
  totalCount: number, 
  isRental: boolean = false
) => {
  const context: StoredSearchContext = {
    filters,
    sortOrder,
    isRental,
    totalCount
  };

  const key = isRental ? 'rentalSearchContext' : 'searchContext';
  sessionStorage.setItem(key, JSON.stringify(context));
  console.log(`Stored ${isRental ? 'rental' : 'resale'} search context:`, context);
};