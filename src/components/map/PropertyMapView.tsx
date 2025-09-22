
import React, { useMemo } from 'react';
import { Property } from '@/components/property/types';
import { FilterValues } from '@/components/SearchFilters';
import PropertyMap from './PropertyMap';

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
  // Prepare map data - convert to the format expected by PropertyMap
  const mapProperties = useMemo(() => {
    console.log('Preparing map data from', allProperties.length, 'total properties (all search results)');
    
    return allProperties
      .filter(property => property.coordinates?.lat && property.coordinates?.lng)
      .map(property => ({
        id: property.id,
        title: property.title,
        location: property.area, // Use area as location for map display
        price: property.price,
        latitude: property.coordinates!.lat,
        longitude: property.coordinates!.lng,
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
      />
    </div>
  );
};
