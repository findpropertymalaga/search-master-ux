
import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useIsMobile } from '@/hooks/use-mobile';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px'
};

interface GoogleMapComponentProps {
  children: React.ReactNode;
  center: google.maps.LatLngLiteral;
  zoom?: number;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  fullscreen?: boolean;
  onLoad?: (map: google.maps.Map) => void;
  options?: google.maps.MapOptions;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  children,
  center,
  zoom = 11,
  onClick,
  fullscreen = false,
  onLoad,
  options,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA1rbhrjkq-bFbKfi8C6iNs4j8abjiOc3U',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const isMobile = useIsMobile();

  console.log('GoogleMapComponent render:', { isMobile, fullscreen, isLoaded });

  const handleOnLoad = useCallback((map: google.maps.Map) => {
    console.log("GoogleMapComponent: Map loaded with center:", center, "zoom:", zoom);
    setMap(map);
    if (onLoad) onLoad(map);
  }, [onLoad, center, zoom]);

  const handleOnUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const mapContainerStyle = {
    ...containerStyle,
    height: fullscreen ? '100vh' : '100%',
    border: fullscreen ? 'none' : '1px solid #e2e8f0',
    borderRadius: fullscreen ? '0' : '0.5rem',
  };

  // Device-specific map options - Force fullscreen controls to always show
  const getMapOptions = (): google.maps.MapOptions => {
    if (!isLoaded) return {};
    
    console.log('Setting map options for:', { isMobile, fullscreen });
    
    const baseOptions: google.maps.MapOptions = {
      fullscreenControl: true, // Always enable fullscreen controls
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      zoomControl: !isMobile, // Only show zoom controls on desktop
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      streetViewControl: false,
      mapTypeControl: false,
      gestureHandling: 'greedy',
      clickableIcons: false,
      draggable: true,
      scrollwheel: true,
      disableDoubleClickZoom: false,
      keyboardShortcuts: !isMobile,
      ...options,
    };

    console.log('Final map options:', baseOptions);
    return baseOptions;
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      onClick={onClick}
      onLoad={handleOnLoad}
      onUnmount={handleOnUnmount}
      options={getMapOptions()}
    >
      {children}
    </GoogleMap>
  ) : (
    <div style={containerStyle} className="flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-costa-600"></div>
        <p className="text-gray-600">Loading Map...</p>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
