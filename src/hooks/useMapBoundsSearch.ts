
import { useCallback } from 'react';
import { FilterValues } from '@/components/SearchFilters';
import { Property } from '@/components/property/types';

export const useMapBoundsSearch = (
  currentFilters: FilterValues,
  onFilterChange: (filters: FilterValues) => void,
  allProperties: Property[]
) => {
  const updateSearchByMapBounds = useCallback((mapBounds: google.maps.LatLngBounds) => {
    console.log("Updating search based on map bounds:", mapBounds.toString());
    
    // Filter properties within the current map bounds
    const propertiesInBounds = allProperties.filter(property => {
      if (!property.latitude || !property.longitude) {
        return false;
      }

      const propertyLatLng = new google.maps.LatLng(
        property.latitude,
        property.longitude
      );

      return mapBounds.contains(propertyLatLng);
    });

    console.log(`Found ${propertiesInBounds.length} properties within current map bounds`);
    
    // Extract unique locations from properties in bounds
    const locationsInBounds = [...new Set(
      propertiesInBounds.map(prop => prop.location).filter(Boolean)
    )];

    // Update filters to include only locations within map bounds
    // Keep all other existing filters intact
    const updatedFilters: FilterValues = {
      ...currentFilters,
      location: locationsInBounds.join(',')
    };

    console.log("Updating filters with locations:", locationsInBounds);
    console.log("Map bounds search completed - filters updated");
    
    onFilterChange(updatedFilters);
  }, [currentFilters, onFilterChange, allProperties]);

  return { updateSearchByMapBounds };
};
