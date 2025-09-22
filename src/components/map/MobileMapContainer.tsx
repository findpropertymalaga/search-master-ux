
import React, { useState } from 'react';
import PropertyMap from './PropertyMap';
import { Property } from '@/components/property/types';

interface MobileMapContainerProps {
  properties: Property[];
  onClose: () => void;
  onPropertyView?: (propertyId: string) => void;
  onMapBoundsSearch?: (bounds: google.maps.LatLngBounds) => void;
}

const MobileMapContainer = ({ 
  properties, 
  onClose, 
  onPropertyView,
  onMapBoundsSearch
}: MobileMapContainerProps) => {
  const handleContainerClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent background clicks from closing the map
    e.stopPropagation();
  };

  // Handle map bounds search - pass through to parent and let parent handle closing
  const handleMapBoundsSearch = (bounds: google.maps.LatLngBounds) => {
    console.log("Mobile map bounds search triggered - passing to parent");
    
    // Pass the bounds search to parent immediately
    if (onMapBoundsSearch) {
      onMapBoundsSearch(bounds);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[900] bg-white"
      onClick={handleContainerClick}
      onTouchStart={handleContainerClick}
    >
      {/* Map - Ensure filters are properly synchronized */}
      <PropertyMap 
        properties={properties} 
        isFullscreen={true}
        onPropertyView={onPropertyView}
        onMapBoundsSearch={onMapBoundsSearch ? handleMapBoundsSearch : undefined}
      />
    </div>
  );
};

export default MobileMapContainer;
