
import React from 'react';
import { X, MapPin } from 'lucide-react';
import { Property } from '@/components/property/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/utils/filterFormatters';

interface MapPropertyCardProps {
  property: Property;
  onClose: () => void;
  onViewDetails: (propertyId: string) => void;
  isFullscreen?: boolean;
}

const MapPropertyCard = ({ 
  property, 
  onClose, 
  onViewDetails, 
  isFullscreen = false 
}: MapPropertyCardProps) => {
  // Don't render if property data is incomplete (loading state)
  if (!property.title || !property.id || property.title === 'Loading...' || property.id === 'loading') {
    return (
      <Card className={`absolute z-[1001] max-w-sm shadow-lg bg-white ${
        isFullscreen 
          ? 'bottom-20 left-4 right-4 mx-auto max-w-xs' 
          : 'bottom-4 left-4'
      }`}>
        <CardContent className="p-0">
          <div className="h-32 w-full bg-muted animate-pulse rounded-t-lg" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
            <div className="flex gap-1">
              <div className="h-5 bg-muted rounded-full w-16 animate-pulse" />
              <div className="h-5 bg-muted rounded-full w-16 animate-pulse" />
            </div>
            <div className="h-8 bg-muted rounded w-full animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleViewDetails = () => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
    onViewDetails(property.id);
  };

  const imageUrl = Array.isArray(property.imageUrl) 
    ? property.imageUrl[0] 
    : property.imageUrl;

  return (
    <Card className={`absolute z-[1001] max-w-sm shadow-lg bg-white ${
      isFullscreen 
        ? 'bottom-20 left-4 right-4 mx-auto max-w-xs' 
        : 'bottom-4 left-4'
    }`}>
      <CardContent className="p-0">
        {/* Property Image */}
        <div className="relative h-32 w-full">
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 h-6 w-6 bg-white/80 hover:bg-white rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Property Details */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">{property.title}</h3>
            <div className="text-costa-600 font-semibold text-sm ml-2">
              {/* Show rental prices if available - prioritize longterm when both exist */}
              {(property.shortterm_low && property.shortterm_low > 0) || (property.longterm && property.longterm > 0) ? (
                <div className="text-right">
                  {/* If both prices exist, show only longterm */}
                  {property.longterm && property.longterm > 0 && property.shortterm_low && property.shortterm_low > 0 ? (
                    <div className="text-xs">{formatPrice(property.longterm)} p/m</div>
                  ) : (
                    /* Otherwise, show whichever is available */
                    <>
                      {property.shortterm_low && property.shortterm_low > 0 && (
                        <div className="text-xs">From {formatPrice(property.shortterm_low)} p/w</div>
                      )}
                      {property.longterm && property.longterm > 0 && (
                        <div className="text-xs">{formatPrice(property.longterm)} p/m</div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                formatPrice(property.price)
              )}
            </div>
          </div>
          
          <div className="flex items-center mb-3 text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0 text-costa-500" />
            <span className="truncate">{property.location}</span>
          </div>
          
          {/* Property Features as Badges - Translated to English */}
          <div className="flex flex-wrap gap-1 text-xs mb-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-800 rounded-full text-xs px-2 py-0.5">
              {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-800 rounded-full text-xs px-2 py-0.5">
              {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-800 rounded-full text-xs px-2 py-0.5">
              {property.area}m²
            </Badge>
            {property.terrace && (
              <Badge variant="outline" className="bg-blue-50 text-blue-800 rounded-full text-xs px-2 py-0.5">
                Terrace {property.terrace}m²
              </Badge>
            )}
            {property.propertyRef && (
              <Badge variant="outline" className="bg-blue-50 text-blue-800 rounded-full text-xs px-2 py-0.5">
                Ref. {property.propertyRef}
              </Badge>
            )}
          </div>

          {/* View Details Button - Translated to English */}
          <Button
            onClick={handleViewDetails}
            className="w-full bg-costa-600 hover:bg-costa-700 text-white text-xs py-2"
            size="sm"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapPropertyCard;
