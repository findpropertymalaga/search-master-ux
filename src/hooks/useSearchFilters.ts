import { useState, useEffect, useRef } from 'react';
import { FilterValues } from '@/components/SearchFilters';

interface UseSearchFiltersProps {
  onFilter: (filters: FilterValues) => void;
  filters: FilterValues;
  isHomePage?: boolean;
}

export const useSearchFilters = (
  onFilter: (filters: FilterValues) => void, 
  initialFilters: FilterValues,
  isHomePage = false
) => {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const prevFiltersRef = useRef<FilterValues>(initialFilters);
  const isInitialSyncRef = useRef(true);
  
  // Keep internal filters in sync with external filters
  useEffect(() => {
    // Store the stringified filters for comparison
    const initialFiltersString = JSON.stringify(initialFilters);
    const prevFiltersString = JSON.stringify(prevFiltersRef.current);
    
    // Only update if the filters have actually changed
    if (initialFiltersString !== prevFiltersString || isInitialSyncRef.current) {
      console.log("useSearchFilters updating internal state with new filters:", initialFilters);
      setFilters(initialFilters);
      prevFiltersRef.current = initialFilters;
      isInitialSyncRef.current = false;
    }
  }, [initialFilters]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    
    // Don't trigger filter on home page with every keystroke
    if (!isHomePage) {
      onFilter(updatedFilters);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const handlePriceChange = (values: number[]) => {
    if (values.length >= 2) {
      const [minPrice, maxPrice] = values;
      const updatedFilters = { ...filters, minPrice, maxPrice };
      setFilters(updatedFilters);
      onFilter(updatedFilters);
    }
  };

  const setLocationFilter = (value: string) => {
    const updatedFilters = { ...filters, location: value };
    setFilters(updatedFilters);
    console.log("Setting location filter:", value);
    onFilter(updatedFilters);
  };

  return {
    filters,
    handleInputChange,
    handleSelectChange,
    handlePriceChange,
    setLocationFilter
  };
};
