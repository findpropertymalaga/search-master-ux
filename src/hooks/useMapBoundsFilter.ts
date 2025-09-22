
import { useState, useCallback, useMemo } from 'react';
import { Property } from '@/components/property/types';

export const useMapBoundsFilter = (allProperties: Property[]) => {
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null);

  const handleBoundsChanged = useCallback((bounds: google.maps.LatLngBounds) => {
    console.log("Map bounds changed:", bounds.toString());
    setMapBounds(bounds);
  }, []);

  // Filter properties within map bounds
  const propertiesInBounds = useMemo(() => {
    if (!mapBounds) {
      return allProperties;
    }

    const filtered = allProperties.filter(property => {
      if (!property.latitude || !property.longitude) {
        return false;
      }

      const propertyLatLng = new google.maps.LatLng(
        property.latitude,
        property.longitude
      );

      return mapBounds.contains(propertyLatLng);
    });

    console.log(`Filtered ${filtered.length} properties within map bounds from ${allProperties.length} total`);
    return filtered;
  }, [allProperties, mapBounds]);

  return {
    mapBounds,
    propertiesInBounds,
    handleBoundsChanged
  };
};
