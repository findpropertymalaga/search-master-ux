
import React from 'react';
import { Property } from '@/components/property/types';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { MapPin, Navigation } from 'lucide-react';

interface PropertyLocationProps {
  property: Property;
}

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const PropertyLocation = ({ property }: PropertyLocationProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || '',
  });

  const handleDirectionsClick = () => {
    if (property.coordinates) {
      const { lat, lng } = property.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  if (!property.coordinates) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-costa-600" />
          Location
        </h3>
        <p className="text-gray-600">
          {property.location || property.area || 'Location information not available'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <MapPin className="mr-2 h-5 w-5 text-costa-600" />
        Location
      </h3>
      
      <p className="text-gray-600 mb-4">
        {property.location || property.area}
      </p>
      
      {!isLoaded ? (
        <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-costa-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-64 rounded-lg overflow-hidden">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: property.coordinates.lat, lng: property.coordinates.lng }}
              zoom={10}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              <Marker 
                position={{ lat: property.coordinates.lat, lng: property.coordinates.lng }}
                title={property.title}
              />
            </GoogleMap>
          </div>
          
          <button
            onClick={handleDirectionsClick}
            className="w-full bg-costa-600 text-white py-2 px-4 rounded-lg hover:bg-costa-700 transition-colors flex items-center justify-center"
          >
            <Navigation className="mr-2 h-4 w-4" />
            Get Directions
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyLocation;
