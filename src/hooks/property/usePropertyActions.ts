
import { Dispatch, SetStateAction } from 'react';
import { Property } from '@/components/property/types';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

interface PropertyState {
  properties: Property[];
  allProperties: Property[];
  loading: boolean;
  loadingMore: boolean;
  page: number;
  hasMore: boolean;
  totalCount: number;
  sortOrder: SortOption;
  error: string | null;
}

interface PropertyActions {
  handleSortChange: (order: SortOption) => void;
  handleLoadMore: () => void;
}

export const usePropertyActions = (
  state: PropertyState,
  setState: Dispatch<SetStateAction<PropertyState>>,
  loadProperties: (pageNumber?: number, isLoadMore?: boolean) => Promise<void>,
): PropertyActions => {
  
  const handleSortChange = (order: SortOption) => {
    console.log("usePropertyActions: Changing sort order to:", order);
    
    // First update the state with the new sort order
    setState(prev => {
      // Check if the sort order is actually changing
      if (prev.sortOrder !== order) {
        console.log(`Changing sort order from ${prev.sortOrder} to ${order}`);
        // Reset to page 1 when sort order changes and set loading to true to show loading state
        return {
          ...prev, 
          sortOrder: order, 
          page: 1,
          loading: true,
          properties: [] // Clear current properties to avoid showing old results during re-sort
        };
      }
      return prev;
    });
    
    // Immediately reload properties with the new sort order (page 1)
    setTimeout(() => {
      loadProperties(1, false);
    }, 0);
  };

  const handleLoadMore = () => {
    console.log("Handle load more called - current page:", state.page);
    if (state.loadingMore) {
      console.log("Already loading more, ignoring request");
      return;
    }
    
    const nextPage = state.page + 1;
    console.log("Setting next page to:", nextPage);
    setState(prev => ({...prev, page: nextPage}));
    loadProperties(nextPage, true);
  };

  return {
    handleSortChange,
    handleLoadMore
  };
};
