
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import GoogleMapComponent from './GoogleMapComponent';
import PropertyMarkers from './PropertyMarkers';
import MapPropertyCard from './MapPropertyCard';
import MapSearchButton from './MapSearchButton';
import { Property } from '@/components/property/types';
import { PropertyMapProps } from './types';
import { useMapBoundsFilter } from '@/hooks/useMapBoundsFilter';

interface PropertyMapExtendedProps extends PropertyMapProps {
  onPropertyView?: (propertyId: string) => void;
  onMapBoundsSearch?: (bounds: google.maps.LatLngBounds, isReset?: boolean) => void;
  onResetMapSearch?: () => void;
  hasActiveLocationFilter?: boolean;
  isMobile?: boolean;
}

const PropertyMap = ({ 
  properties, 
  isFullscreen = false,
  onPropertyView,
  onMapBoundsSearch,
  onResetMapSearch,
  hasActiveLocationFilter = false,
  isMobile = false
}: PropertyMapExtendedProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentBounds, setCurrentBounds] = useState<google.maps.LatLngBounds | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Use map bounds filtering to get properties visible in current viewport
  // This should use the same properties that are passed to the map (filtered search results)
  const { propertiesInBounds, handleBoundsChanged } = useMapBoundsFilter(properties);

  // Calculate center based on properties or default to Costa del Sol area
  const mapCenter = useMemo(() => {
    if (properties.length > 0) {
      // Calculate center from properties with valid coordinates
      const validProperties = properties.filter(p => 
        p.latitude && p.longitude && 
        typeof p.latitude === 'number' && 
        typeof p.longitude === 'number'
      );
      
      if (validProperties.length > 0) {
        const avgLat = validProperties.reduce((sum, p) => sum + p.latitude!, 0) / validProperties.length;
        const avgLng = validProperties.reduce((sum, p) => sum + p.longitude!, 0) / validProperties.length;
        console.log(`Map center calculated from ${validProperties.length} properties:`, { lat: avgLat, lng: avgLng });
        return { lat: avgLat, lng: avgLng };
      }
    }
    
    // Default to Costa del Sol center (between Marbella and Malaga)
    console.log("Using default map center for Costa del Sol");
    return { lat: 36.5270, lng: -4.6260 };
  }, [properties]);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    console.log("Map loaded successfully with center:", mapCenter);
    setMap(mapInstance);
    mapRef.current = mapInstance;

    // Add bounds change listener
    mapInstance.addListener('bounds_changed', () => {
      const bounds = mapInstance.getBounds();
      if (bounds) {
        setCurrentBounds(bounds);
        handleBoundsChanged(bounds);
      }
    });
  }, [mapCenter]);

  const handlePropertySelect = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  const handleClosePropertyCard = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  const handleViewPropertyDetails = useCallback((propertyId: string) => {
    if (onPropertyView) {
      onPropertyView(propertyId);
    } else {
      // Default navigation
      window.location.href = `/properties/${propertyId}`;
    }
  }, [onPropertyView]);

  const handleMapBoundsSearch = useCallback(() => {
    if (currentBounds && onMapBoundsSearch) {
      console.log("Triggering map bounds search (regular)");
      onMapBoundsSearch(currentBounds, false);
    }
  }, [currentBounds, onMapBoundsSearch]);

  const handleMapReset = useCallback(() => {
    if (onResetMapSearch) {
      console.log("Triggering map reset - keeping map visible");
      onResetMapSearch();
    }
  }, [onResetMapSearch]);

  // Count properties visible in current map bounds
  // Use the filtered properties (same as search results) instead of all properties
  const visiblePropertiesCount = useMemo(() => {
    const count = propertiesInBounds.length;
    console.log(`PropertyMap: ${count} filtered properties visible in current map bounds out of ${properties.length} total filtered results`);
    return count;
  }, [propertiesInBounds, properties.length]);

  // Log when properties change to help with debugging
  useEffect(() => {
    console.log(`PropertyMap: Received ${properties.length} properties for display`);
  }, [properties.length]);

  const containerClasses = cn(
    "relative w-full h-full",
    isFullscreen && "fixed inset-0 z-[900]"
  );

  return (
    <div className={containerClasses}>
      <GoogleMapComponent 
        fullscreen={isFullscreen} 
        onLoad={handleMapLoad}
        center={mapCenter}
        zoom={11}
      >
        <PropertyMarkers 
          properties={properties}
          map={map}
          onSelectProperty={handlePropertySelect}
        />
      </GoogleMapComponent>

      {/* Map Search Button - only show if we have a bounds search handler */}
      {onMapBoundsSearch && currentBounds && (
        <MapSearchButton
          onClick={handleMapBoundsSearch}
          onReset={hasActiveLocationFilter ? handleMapReset : undefined}
          isFullscreen={isFullscreen}
          propertiesCount={visiblePropertiesCount}
          hasActiveFilter={hasActiveLocationFilter}
          isMobile={isMobile}
        />
      )}

      {selectedProperty && (
        <MapPropertyCard 
          property={selectedProperty}
          onClose={handleClosePropertyCard}
          onViewDetails={handleViewPropertyDetails}
          isFullscreen={isFullscreen}
        />
      )}
    </div>
  );
};

export default PropertyMap;
