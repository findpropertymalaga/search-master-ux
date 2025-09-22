
import React, { useMemo, useCallback } from 'react';
import { Property } from '@/components/property/types';
import { FilterValues } from '@/components/SearchFilters';
import PropertyMap from '@/components/map/PropertyMap';
import { useMapBoundsSearch } from '@/hooks/useMapBoundsSearch';

interface PropertyMapViewProps {
  allProperties: Property[];
  showMap: boolean;
  isFullscreenMap: boolean;
  isMobile: boolean;
  onToggleMap: () => void;
  currentFilters?: FilterValues;
  onFilterChange?: (filters: FilterValues) => void;
}

export const PropertyMapView: React.FC<PropertyMapViewProps> = ({
  allProperties,
  showMap,
  isFullscreenMap,
  isMobile,
  onToggleMap,
  currentFilters,
  onFilterChange
}) => {
  // Provide default values for filters to avoid TypeScript errors
  const defaultFilters: FilterValues = {
    location: '',
    type: '',
    minPrice: 0,
    maxPrice: 10000000,
    bedrooms: '',
    bathrooms: '',
    has_pool: false,
    has_garden: false,
    has_garage: false,
  };

  const safeCurrentFilters = currentFilters || defaultFilters;
  const safeOnFilterChange = onFilterChange || (() => {});

  // Map bounds search functionality
  const { updateSearchByMapBounds } = useMapBoundsSearch(
    safeCurrentFilters,
    safeOnFilterChange,
    allProperties
  );

  const handleMapBoundsSearch = useCallback((bounds: google.maps.LatLngBounds, isReset = false) => {
    console.log("=== MAP BOUNDS SEARCH ===");
    console.log("Is reset operation:", isReset);
    console.log("Mobile device:", isMobile);
    
    updateSearchByMapBounds(bounds);
    
    // On mobile, hide the map after search to show listings - BUT NOT for reset operations
    if (isMobile && onToggleMap && !isReset) {
      console.log("Map bounds search completed on mobile - hiding map to show listings");
      onToggleMap();
    } else if (isReset) {
      console.log("Reset operation - keeping map visible");
    }
  }, [updateSearchByMapBounds, isMobile, onToggleMap]);

  const handleResetMapSearch = useCallback(() => {
    console.log("=== RESETTING MAP SEARCH ===");
    console.log("Mobile device:", isMobile);
    console.log("Current filters before reset:", currentFilters);
    console.log("Clearing location filter without closing map");
    console.log("onToggleMap function:", onToggleMap);
    console.log("Current showMap state should remain true");
    
    if (onFilterChange && currentFilters) {
      // Remove location filter to reset map search
      const { location, ...restFilters } = currentFilters;
      const newFilters = {
        ...defaultFilters,
        ...restFilters,
        location: '' // Reset location to empty string
      };
      
      console.log("New filters after reset:", newFilters);
      console.log("About to call onFilterChange - this should NOT close the map");
      
      // Create a custom marker to track this specific reset operation
      (window as any).mapResetInProgress = true;
      console.log("Setting mapResetInProgress flag to true");
      
      onFilterChange(newFilters);
      
      // Clear the flag after a short delay to ensure it doesn't interfere with future operations
      setTimeout(() => {
        (window as any).mapResetInProgress = false;
        console.log("Cleared mapResetInProgress flag");
      }, 1000);
    }
    
    console.log("=== RESET COMPLETE - MAP SHOULD STAY VISIBLE ===");
    console.log("NOT calling onToggleMap - map should remain visible");
  }, [onFilterChange, currentFilters, defaultFilters, isMobile, onToggleMap]);

  // Check if there's an active location filter from map bounds
  const hasActiveLocationFilter = Boolean(safeCurrentFilters.location);
  // Prepare map data - convert to the format expected by PropertyMap
  const mapProperties = useMemo(() => {
    console.log('Preparing map data from', allProperties.length, 'total properties (filtered search results)');
    
    // Don't filter out properties without coordinates - let PropertyMarkers handle coordinate generation
    return allProperties.map(property => ({
      id: property.id,
      title: property.title,
      location: property.area, // Use area as location for map display
      price: property.price,
      latitude: property.coordinates?.lat || property.latitude,
      longitude: property.coordinates?.lng || property.longitude,
      imageUrl: property.images?.[0] || property.imageUrl || '',
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      size: property.size,
      images: property.images,
      description: property.description,
      features: property.features,
      propertyType: property.propertyType,
      yearBuilt: property.yearBuilt,
      energyRating: property.energyRating,
      parking: property.parking,
      garden: property.garden,
      pool: property.pool,
      status: property.status,
      listedDate: property.listedDate,
      currency: property.currency,
      province: property.province,
      town: property.town,
      urbanisation: property.urbanisation,
      developmentName: property.developmentName,
      plotSize: property.plotSize,
      coordinates: property.coordinates,
      type: property.type,
      listed_date: property.listed_date
    }));
  }, [allProperties]);

  if (!showMap) return null;

  return (
    <div className={`${isFullscreenMap ? 'fixed inset-0 z-50' : 'h-96'} w-full`}>
      <PropertyMap
        properties={mapProperties}
        isFullscreen={isFullscreenMap}
        onMapBoundsSearch={handleMapBoundsSearch}
        onResetMapSearch={handleResetMapSearch}
        hasActiveLocationFilter={hasActiveLocationFilter}
        isMobile={isMobile}
      />
    </div>
  );
};
