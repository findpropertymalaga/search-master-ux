import { useEffect, useRef } from 'react';

interface ScrollMemoryState {
  scrollY: number;
  page: number;
  propertiesCount: number;
  sortOrder: string;
  filtersHash: string;
}

/**
 * Hook to manage scroll position and pagination memory for property listings
 */
export const useScrollMemory = (
  properties: any[],
  currentPage: number,
  sortOrder: string,
  currentFilters: any,
  loadProperties: (page: number, isLoadMore: boolean) => Promise<void>,
  pageType: 'buy' | 'rent' = 'buy'
) => {
  const restoreInProgress = useRef(false);
  const hasRestoredRef = useRef(false);
  const storageKey = `propertyListingScrollState_${pageType}`;

  // Save current state when navigating away
  const saveScrollState = () => {
    const filtersHash = JSON.stringify(currentFilters);
    const scrollState: ScrollMemoryState = {
      scrollY: window.scrollY,
      page: currentPage,
      propertiesCount: properties.length,
      sortOrder,
      filtersHash
    };
    
    sessionStorage.setItem(storageKey, JSON.stringify(scrollState));
    console.log(`Saved ${pageType} scroll state:`, scrollState);
  };

  // Restore state when component mounts
  const restoreScrollState = async () => {
    if (restoreInProgress.current || hasRestoredRef.current) return;
    
    const savedStateStr = sessionStorage.getItem(storageKey);
    if (!savedStateStr) return;

    try {
      const savedState: ScrollMemoryState = JSON.parse(savedStateStr);
      const currentFiltersHash = JSON.stringify(currentFilters);
      
      // Only restore if filters and sort order match
      if (savedState.filtersHash !== currentFiltersHash || savedState.sortOrder !== sortOrder) {
        console.log(`${pageType} filters or sort order changed, not restoring scroll state`);
        sessionStorage.removeItem(storageKey);
        return;
      }

      console.log(`Restoring ${pageType} scroll state:`, savedState);
      restoreInProgress.current = true;

      // If we need to load more pages to restore the view
      if (savedState.page > currentPage) {
        console.log(`Loading ${pageType} pages up to ${savedState.page} to restore view`);
        
        // Load all pages sequentially to restore the full view
        for (let page = 2; page <= savedState.page; page++) {
          await loadProperties(page, true);
        }
      }

      // Wait a bit for DOM to update, then restore scroll
      setTimeout(() => {
        window.scrollTo(0, savedState.scrollY);
        console.log(`Restored ${pageType} scroll position to ${savedState.scrollY}`);
        
        // Clean up
        sessionStorage.removeItem(storageKey);
        restoreInProgress.current = false;
        hasRestoredRef.current = true;
      }, 100);

    } catch (error) {
      console.error(`Error restoring ${pageType} scroll state:`, error);
      sessionStorage.removeItem(storageKey);
      restoreInProgress.current = false;
    }
  };

  // Restore on mount with proper dependencies
  useEffect(() => {
    if (properties.length > 0 && !hasRestoredRef.current) {
      restoreScrollState();
    }
  }, [properties.length, currentFilters, sortOrder]);

  // Disable browser scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return {
    saveScrollState,
    isRestoring: restoreInProgress.current
  };
};