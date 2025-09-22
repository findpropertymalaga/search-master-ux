
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterValues } from '@/components/SearchFilters';
import ActiveFilterBadge from '@/components/ActiveFilterBadge';
import { getPropertyTypeDisplay as getPropertyTypeDisplayHelper } from '@/utils/typeDisplayHelpers';
import { getPropertyTypeDisplay, formatPrice } from '@/utils/filterFormatters';
import { normalizeRoomValue, getRoomDisplayText } from '@/utils/roomFilterHelpers';
import { bedroomOptions, bathroomOptions } from '@/components/filters/RoomOptions';
import { featureOptions } from '@/components/filters/FeatureOptions';

/**
 * Custom hook to manage active filter badges
 */
export const useActiveFilters = (
  currentFilters: FilterValues, 
  onFilterChange: (filters: FilterValues) => void
) => {
  const [searchParams] = useSearchParams();
  const [filterBoxesKey, setFilterBoxesKey] = useState(0);
  const [activeFilters, setActiveFilters] = useState<React.ReactNode[]>([]);

  // Function to remove a specific filter
  const removeFilter = (filterName: keyof FilterValues, specificValue?: string) => {
    console.log("Removing filter:", filterName, specificValue);
    
    // Create a new filters object based on current filters
    const newFilters = { ...currentFilters };
    
    // Reset the specified filter
    if (filterName === 'location') {
      // If a specific location is provided, only remove that location
      if (specificValue && currentFilters.location) {
        const locations = currentFilters.location.split(',');
        const updatedLocations = locations.filter(loc => loc.trim() !== specificValue.trim());
        newFilters.location = updatedLocations.join(',');
      } else {
        // Otherwise, clear all locations
        newFilters.location = '';
      }
    } else if (filterName === 'type') {
      // If a specific type is provided, only remove that type
      if (specificValue && currentFilters.type && currentFilters.type !== 'any') {
        const typeArray = Array.isArray(currentFilters.type) 
          ? currentFilters.type 
          : currentFilters.type.split(',').filter(Boolean);
        const updatedTypes = typeArray.filter(type => type.trim() !== specificValue.trim());
        newFilters.type = updatedTypes.length === 0 ? 'any' : updatedTypes;
      } else {
        // Otherwise, clear all types
        newFilters.type = 'any';
      }
    } else if (filterName === 'bedrooms') {
      if (specificValue) {
        const currentValues = currentFilters.bedrooms ? currentFilters.bedrooms.split(',') : [];
        const updatedValues = currentValues.filter(v => v !== specificValue);
        newFilters.bedrooms = updatedValues.length > 0 ? updatedValues.join(',') : 'any';
      } else {
        newFilters.bedrooms = 'any';
      }
    } else if (filterName === 'bathrooms') {
      if (specificValue) {
        const currentValues = currentFilters.bathrooms ? currentFilters.bathrooms.split(',') : [];
        const updatedValues = currentValues.filter(v => v !== specificValue);
        newFilters.bathrooms = updatedValues.length > 0 ? updatedValues.join(',') : 'any';
      } else {
        newFilters.bathrooms = 'any';
      }
    } else if (filterName === 'minPrice' || filterName === 'maxPrice') {
      newFilters.minPrice = 0;
      newFilters.maxPrice = 5000000;
    } else {
      // Handle feature filters
      newFilters[filterName] = false;
    }
    
    // Apply the updated filters
    onFilterChange(newFilters);
    
    // Force re-render of filter boxes
    setFilterBoxesKey(prev => prev + 1);
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    // Clear all filters by calling onFilterChange with default values
    onFilterChange({
      location: '',
      type: 'any',
      minPrice: 0,
      maxPrice: 5000000,
      bedrooms: 'any',
      bathrooms: 'any',
      has_pool: false,
      has_garden: false,
      has_garage: false,
      covered_terrace: false,
      lift: false,
      fitted_wardrobes: false,
      near_transport: false,
      private_terrace: false,
      gym: false,
      sauna: false,
      games_room: false,
      paddle_tennis: false,
      tennis_court: false,
      storage_room: false,
      utility_room: false,
      ensuite_bathroom: false,
      accessibility: false,
      double_glazing: false,
      fiber_optic: false,
      solarium: false,
      guest_apartment: false,
      jacuzzi: false,
      bar: false,
      barbeque: false,
      domotics: false,
      basement: false,
    });
    
    // Force re-render of filter boxes
    setFilterBoxesKey(prev => prev + 1);
  };

  // Function to generate active filters
  const generateActiveFilters = () => {
    const filters = [];
    
    // Handle multiple locations - ensure they are properly displayed
    if (currentFilters.location) {
      const locations = currentFilters.location
        .split(',')
        .filter(Boolean)
        .map(location => location.trim());
      
      // Add each location as a separate filter badge
      locations.forEach(location => {
        if (location) {
          filters.push(
            <ActiveFilterBadge
              key={`location-${location}`}
              value={location}
              onRemove={() => removeFilter('location', location)}
            />
          );
        }
      });
    }
    
    // Handle multiple types - display each type as a separate badge
    if (currentFilters.type && currentFilters.type !== 'any') {
      const typeArray = Array.isArray(currentFilters.type) 
        ? currentFilters.type 
        : currentFilters.type.split(',').filter(Boolean);
      
      // Add each type as a separate filter badge
      typeArray.forEach(type => {
        const trimmedType = type.trim();
        if (trimmedType && trimmedType !== 'any') {
          const displayName = getPropertyTypeDisplayHelper(trimmedType);
          filters.push(
            <ActiveFilterBadge
              key={`type-${trimmedType}`}
              value={displayName}
              onRemove={() => removeFilter('type', trimmedType)}
            />
          );
        }
      });
    }

    // Bedrooms badges - separate badge for each selected value
    if (currentFilters.bedrooms && currentFilters.bedrooms !== 'any') {
      const bedroomValues = currentFilters.bedrooms.split(',').filter(v => v !== 'any');
      bedroomValues.forEach(value => {
        const option = bedroomOptions.find(opt => opt.value === value);
        const label = option ? option.label : value;
        filters.push(
          <ActiveFilterBadge
            key={`bedrooms-${value}`}
            value={`${label} bedrooms`}
            onRemove={() => removeFilter('bedrooms', value)}
          />
        );
      });
    }
    
    // Bathrooms badges - separate badge for each selected value
    if (currentFilters.bathrooms && currentFilters.bathrooms !== 'any') {
      const bathroomValues = currentFilters.bathrooms.split(',').filter(v => v !== 'any');
      bathroomValues.forEach(value => {
        const option = bathroomOptions.find(opt => opt.value === value);
        const label = option ? option.label : value;
        filters.push(
          <ActiveFilterBadge
            key={`bathrooms-${value}`}
            value={`${label} bathrooms`}
            onRemove={() => removeFilter('bathrooms', value)}
          />
        );
      });
    }
    
    // Check for price filter - improved detection logic
    const hasCustomPriceFilter = 
      searchParams.has('minPrice') ||
      searchParams.has('maxPrice') ||
      currentFilters.minPrice > 0 || 
      currentFilters.maxPrice < 5000000;
    
    if (hasCustomPriceFilter) {
      filters.push(
        <ActiveFilterBadge
          key="price"
          label="Price"
          value={`${formatPrice(currentFilters.minPrice)} - ${formatPrice(currentFilters.maxPrice)}`}
          onRemove={() => removeFilter('minPrice')} // This resets both min and max price
        />
      );
    }

    // Add feature filter badges
    featureOptions.forEach(feature => {
      if (currentFilters[feature.key as keyof FilterValues]) {
        filters.push(
          <ActiveFilterBadge
            key={feature.key}
            value={feature.label}
            onRemove={() => removeFilter(feature.key as keyof FilterValues)}
          />
        );
      }
    });
    
    return filters;
  };

  // Update active filters whenever URL params or currentFilters change
  useEffect(() => {
    const filters = generateActiveFilters();
    setActiveFilters(filters);
  }, [searchParams, currentFilters, filterBoxesKey]);

  // Force regeneration of filters when component mounts or URL changes
  useEffect(() => {
    setFilterBoxesKey(prev => prev + 1);
  }, [searchParams]);

  return {
    activeFilters,
    clearAllFilters,
    filterBoxesKey
  };
};

export default useActiveFilters;
