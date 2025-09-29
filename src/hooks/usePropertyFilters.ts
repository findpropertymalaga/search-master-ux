
import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { FilterValues } from '@/components/SearchFilters';
import { parseNumericParam, createFilterParams } from '@/utils/urlParamUtils';
import { useFilterSync } from '@/hooks/useFilterSync';

const SESSION_STORAGE_KEY = 'propertySearchFilters';

export const usePropertyFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);
  const { isUpdatingRef, filterChangeTimeoutRef, mountedRef } = useFilterSync();
  const location = useLocation();

  // Get filters from URL params with proper defaults - key fix for price filters
  const minPrice = parseNumericParam(searchParams.get('minPrice'), 0);
  const maxPrice = parseNumericParam(searchParams.get('maxPrice'), 5000000);
  
  // Helper function to encode feature keys for URL (matching urlParamUtils)
  const encodeFeatureKey = (key: string) => {
    return key.replace(/\s+/g, '_').replace(/-/g, '____');
  };

  // Helper function to decode feature keys from URL (matching urlParamUtils)
  const decodeFeatureKey = (encodedKey: string) => {
    return encodedKey.replace(/____/g, '-').replace(/_/g, ' ');
  };

  // Helper function to check if a key is an encoded feature
  const isEncodedFeatureKey = (key: string) => {
    return key.includes('_') && (key.includes('Features') || key.includes('Climate') || key.includes('Kitchen') || key.includes('Setting') || key.includes('Orientation') || key.includes('Views') || key.includes('Condition') || key.includes('Utilities') || key.includes('Pool') || key.includes('Security'));
  };

  // Define the new feature keys
  const newFeatureKeys = [
    'Features - Private Terrace', 'Climate Control - Air Conditioning', 'Kitchen - Fully Fitted',
    'Features - Fitted Wardrobes', 'Setting - Close To Shops', 'Features - Covered Terrace',
    'Setting - Close To Schools', 'Orientation - South', 'Views - Sea', 'Condition - Excellent',
    'Utilities - Electricity', 'Views - Mountain', 'Setting - Close To Sea', 'Pool - Communal',
    'Pool - Private', 'Security - Gated Complex', 'Setting - Close To Town', 'Features - Ensuite Bathroom',
    'Features - Storage Room', 'Features - Near Transport', 'Features - Double Glazing'
  ];

  // Create feature filters object dynamically
  const featureFilters: Record<string, boolean> = {};
  newFeatureKeys.forEach(key => {
    const encodedKey = encodeFeatureKey(key);
    featureFilters[key] = searchParams.get(encodedKey) === 'true';
  });

  // Get filters from URL params with proper defaults (including all feature filters)
  const currentFilters: FilterValues = {
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || 'any',
    minPrice: minPrice,
    maxPrice: maxPrice,
    bedrooms: searchParams.get('bedrooms') || 'any',
    bathrooms: searchParams.get('bathrooms') || 'any',
    has_pool: searchParams.get('has_pool') === 'true',
    has_garden: searchParams.get('has_garden') === 'true',
    has_garage: searchParams.get('has_garage') === 'true',
    // Add dynamic feature filters
    ...featureFilters,
    // Legacy feature filters for backward compatibility
    covered_terrace: searchParams.get('covered_terrace') === 'true',
    lift: searchParams.get('lift') === 'true',
    fitted_wardrobes: searchParams.get('fitted_wardrobes') === 'true',
    near_transport: searchParams.get('near_transport') === 'true',
    private_terrace: searchParams.get('private_terrace') === 'true',
    gym: searchParams.get('gym') === 'true',
    sauna: searchParams.get('sauna') === 'true',
    games_room: searchParams.get('games_room') === 'true',
    paddle_tennis: searchParams.get('paddle_tennis') === 'true',
    tennis_court: searchParams.get('tennis_court') === 'true',
    storage_room: searchParams.get('storage_room') === 'true',
    utility_room: searchParams.get('utility_room') === 'true',
    ensuite_bathroom: searchParams.get('ensuite_bathroom') === 'true',
    accessibility: searchParams.get('accessibility') === 'true',
    double_glazing: searchParams.get('double_glazing') === 'true',
    fiber_optic: searchParams.get('fiber_optic') === 'true',
    solarium: searchParams.get('solarium') === 'true',
    guest_apartment: searchParams.get('guest_apartment') === 'true',
    jacuzzi: searchParams.get('jacuzzi') === 'true',
    bar: searchParams.get('bar') === 'true',
    barbeque: searchParams.get('barbeque') === 'true',
    domotics: searchParams.get('domotics') === 'true',
    basement: searchParams.get('basement') === 'true',
  };

  // Load filters from session storage when navigating back to properties or rent page
  useEffect(() => {
    if (!isInitialized && (location.pathname === '/properties' || location.pathname === '/rent' || location.pathname === '/') && mountedRef.current) {
      // Check if we came from home page by looking at the referrer or previous navigation
      const urlParams = new URLSearchParams(window.location.search);
      const hasUrlParams = Array.from(urlParams.keys()).length > 0;
      
      // Try to restore filters from session storage when initializing on the properties/rent page
      try {
        const savedFilters = sessionStorage.getItem(SESSION_STORAGE_KEY);
        
        // Only restore saved filters if:
        // 1. There are saved filters
        // 2. There are no URL parameters already set (indicating fresh navigation)
        // 3. The saved filters are compatible with the current page
        if (savedFilters && !hasUrlParams) {
          const parsedFilters = JSON.parse(savedFilters) as FilterValues;
          
          // Check for incompatible filters between buy and rent pages
          const isOnBuyPage = location.pathname === '/properties' || location.pathname === '/';
          const isOnRentPage = location.pathname === '/rent';
          const hasRentalTypes = parsedFilters.type && (parsedFilters.type.includes('short-term') || parsedFilters.type.includes('long-term'));
          const hasBuyTypes = parsedFilters.type && (parsedFilters.type.includes('apartment') || parsedFilters.type.includes('house') || parsedFilters.type.includes('new-devs') || parsedFilters.type.includes('commercial'));
          
          if ((isOnBuyPage && hasRentalTypes) || (isOnRentPage && hasBuyTypes && !hasRentalTypes)) {
            console.log("Clearing incompatible filters for current page");
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
          } else {
            console.log("Restoring filters from session storage:", parsedFilters);
            const newParams = createFilterParams(parsedFilters);
            setSearchParams(newParams, { replace: true });
          }
        } else if (hasUrlParams) {
          console.log("URL already has parameters, using those instead");
        }
        
        // Mark as initialized to prevent multiple restorations
        setIsInitialized(true);
      } catch (error) {
        console.error("Error restoring filters:", error);
        setIsInitialized(true);
      }
    }
  }, [isInitialized, searchParams, setSearchParams, location.pathname, mountedRef]);

  // Save current filters to session storage whenever they change
  useEffect(() => {
    if (isInitialized && (location.pathname === '/properties' || location.pathname === '/rent' || location.pathname === '/')) {
      // Save current filters to session storage for restoration later
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentFilters));
      console.log("Saving filters to session storage:", currentFilters);
    }
  }, [currentFilters, isInitialized, location.pathname]);

  // Clear filters when leaving properties or rent pages
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (location.pathname !== '/properties' && location.pathname !== '/rent' && location.pathname !== '/') {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        console.log("Clearing filters - left properties/rent page");
      }
    };

    // Clear filters immediately if we're not on a properties/rent page
    if (isInitialized && location.pathname !== '/properties' && location.pathname !== '/rent' && location.pathname !== '/') {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      console.log("Clearing filters - navigated away from properties/rent");
    }

    return () => {
      // Cleanup function doesn't need to do anything here
    };
  }, [location.pathname, isInitialized]);

  // This effect ensures filters are properly restored when navigating back to the search page
  useEffect(() => {
    if (isInitialized && (location.pathname === '/properties' || location.pathname === '/')) {
      console.log("Location changed to properties, ensuring filters are restored:", 
        Object.fromEntries(searchParams.entries()));
    }
  }, [location.pathname, searchParams, isInitialized]);

  const handleFilterChange = (filters: FilterValues) => {
    // Check if this is a map reset operation
    if ((window as any).mapResetInProgress) {
      console.log("Filter change detected during map reset - should NOT close map");
    } else {
      console.log("Regular filter change");
    }
    
    // Prevent concurrent updates
    if (isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    
    // Clear any pending timeout
    if (filterChangeTimeoutRef.current) {
      clearTimeout(filterChangeTimeoutRef.current);
    }
    
    // Use a timeout to batch filter changes
    filterChangeTimeoutRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return; // Don't update if unmounted
      
      console.log("Applying filter changes:", filters);
      
      // Save to session storage immediately
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(filters));
      
      // Update URL params with filters - this will trigger a re-fetch via the useEffect
      const newParams = createFilterParams(filters);
      
      console.log("Setting search params:", Object.fromEntries(newParams.entries()));
      
      if (mountedRef.current) {
        setSearchParams(newParams, { replace: true }); // Use replace to avoid adding to browser history
      }
      
      // Reset the updating flag
      isUpdatingRef.current = false;
      filterChangeTimeoutRef.current = null;
    }, 400); // Use a longer debounce to batch changes
  };

  return {
    currentFilters,
    handleFilterChange,
    setSearchParams,
    isInitialized
  };
};
