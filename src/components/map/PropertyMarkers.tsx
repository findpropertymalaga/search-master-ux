
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Property } from './types';

interface PropertyMarkersProps {
  properties: Property[];
  map: google.maps.Map | null;
  onSelectProperty: (property: Property) => void;
}

const PropertyMarkers = ({ properties, map, onSelectProperty }: PropertyMarkersProps) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clusterRef = useRef<MarkerClusterer | null>(null);
  const previousPropertiesRef = useRef<string>("");
  
  console.log(`PropertyMarkers: Received ${properties.length} properties`);
  
  const clearMarkers = useCallback(() => {
    if (clusterRef.current) {
      clusterRef.current.clearMarkers();
      clusterRef.current = null;
    }
    markersRef.current.forEach(marker => {
      if (marker) marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  // Memoize valid properties to avoid recalculation
  const validProperties = useMemo(() => {
    return properties.filter(property => {
      const lat = property.coordinates?.lat || property.latitude;
      const lng = property.coordinates?.lng || property.longitude;
      return lat && lng;
    });
  }, [properties]);

  const createMarkers = useCallback(() => {
    if (!map || !validProperties.length) {
      clearMarkers();
      return;
    }
    
    // Create signature based on valid properties only
    const propertiesSignature = `${validProperties.length}-${validProperties.map(p => p.id).join(',')}`;
    
    // Only recreate if properties actually changed
    if (propertiesSignature !== previousPropertiesRef.current) {
      previousPropertiesRef.current = propertiesSignature;
      console.log(`Creating ${validProperties.length} clustered markers`);
      
      clearMarkers();
      
      const bounds = new google.maps.LatLngBounds();
      const markers: google.maps.Marker[] = [];
      
      // Create markers without animation for better performance
      validProperties.forEach(property => {
        try {
          const lat = property.coordinates?.lat || property.latitude;
          const lng = property.coordinates?.lng || property.longitude;
          
          if (!lat || !lng) return;
          
          const position = { lat, lng };
          bounds.extend(position);
          
          const marker = new google.maps.Marker({
            position,
            map: null, // Don't add to map yet - let clusterer handle it
            clickable: true,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8, // Smaller for better clustering performance
              fillColor: '#1e3a8a',
              fillOpacity: 0.8,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              strokeOpacity: 1,
            }
          });
          
          marker.addListener('click', () => {
            onSelectProperty(property);
          });
          
          markers.push(marker);
        } catch (error) {
          console.error(`Error creating marker for property ${property.id}:`, error);
        }
      });
      
      markersRef.current = markers;
      
      // Create clusterer for better performance with many markers
      if (markers.length > 0) {
        clusterRef.current = new MarkerClusterer({
          map,
          markers,
          renderer: {
            render: ({ count, position }, stats) => {
              const svg = `<svg fill="#1e3a8a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
                <circle cx="120" cy="120" opacity=".6" r="70" />
                <circle cx="120" cy="120" opacity=".3" r="90" />
                <circle cx="120" cy="120" opacity=".2" r="110" />
                <text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif" font-weight="bold">${count}</text>
              </svg>`;
              
              return new google.maps.Marker({
                position,
                icon: {
                  url: `data:image/svg+xml;base64,${btoa(svg)}`,
                  scaledSize: new google.maps.Size(50, 50),
                },
                title: `${count} listings`,
                zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
              });
            },
          },
        });
      }
      
      // Fit bounds with debounce to avoid excessive updates
      if (!bounds.isEmpty()) {
        setTimeout(() => {
          map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
          
          // Set reasonable zoom limits
          const listener = google.maps.event.addListenerOnce(map, 'idle', () => {
            const currentZoom = map.getZoom();
            if (currentZoom && currentZoom > 15) {
              map.setZoom(15);
            } else if (currentZoom && currentZoom < 8) {
              map.setZoom(8);
            }
          });
        }, 100);
      }
    }
  }, [map, validProperties, onSelectProperty, clearMarkers]);

  useEffect(() => {
    createMarkers();
    
    return () => {
      clearMarkers();
    };
  }, [createMarkers, clearMarkers]);

  return null;
};

export default PropertyMarkers;
