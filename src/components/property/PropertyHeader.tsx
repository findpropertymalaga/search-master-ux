
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink } from 'lucide-react';
import { DetailedProperty } from '@/components/property/types';
import { formatPrice } from '@/utils/filterFormatters';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import PropertyMapModal from './PropertyMapModal';

interface PropertyHeaderProps {
  property: DetailedProperty;
  onLocationClick?: () => void;
  isRental?: boolean;
}

const PropertyHeader = ({ property, onLocationClick, isRental = false }: PropertyHeaderProps) => {
  // Debug: Log rental pricing data for troubleshooting
  console.log('PropertyHeader - Property data:', {
    id: property.id,
    shortterm_low: property.shortterm_low,
    longterm: property.longterm,
    price: property.price,
    title: property.title?.substring(0, 50)
  });

  const isMobile = useIsMobile();
  const hasLocation = Boolean(property.location && property.location.trim());
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const handleShowOnMap = () => {
    if (hasLocation) {
      setIsMapModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
          {property.title}
        </h1>
        <div className="text-2xl md:text-3xl font-serif font-bold text-costa-700">
          {/* Show rental prices if available - prioritize longterm when both exist */}
          {(property.shortterm_low && property.shortterm_low > 0) || (property.longterm && property.longterm > 0) ? (
            <div>
              {/* If both prices exist, show only longterm */}
              {property.longterm && property.longterm > 0 && property.shortterm_low && property.shortterm_low > 0 ? (
                <div>{formatPrice(property.longterm)} p/m</div>
              ) : (
                /* Otherwise, show whichever is available */
                <>
                  {property.shortterm_low && property.shortterm_low > 0 && (
                    <div>From {formatPrice(property.shortterm_low)} p/w</div>
                  )}
                  {property.longterm && property.longterm > 0 && (
                    <div>{formatPrice(property.longterm)} p/m</div>
                  )}
                </>
              )}
            </div>
          ) : property.price > 0 ? (
            <>
              <span className="text-lg font-normal mr-1">{isRental ? 'From' : 'Asking price'}</span>
              {formatPrice(property.price)}
            </>
          ) : (
            <span className="text-lg font-normal">Price upon request</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-gray-600 mb-6">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.location}</span>
        </div>
        
        {hasLocation && (
          <button
            onClick={handleShowOnMap}
            className="flex items-center text-costa-600 hover:text-costa-700 transition-colors text-sm"
            title="Show on Google Maps"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Show on map
          </button>
        )}
      </div>

      {/* Large badges - bedrooms, bathrooms, area */}
      <div className="flex gap-3 mb-6">
        <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-800">{property.bedrooms}</div>
            <div className="text-xs text-blue-600 uppercase tracking-wide">Beds</div>
          </div>
        </div>
        
        <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-800">{property.bathrooms}</div>
            <div className="text-xs text-blue-600 uppercase tracking-wide">Baths</div>
          </div>
        </div>
        
        <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-800">
              {property.propertyType?.toLowerCase().startsWith('plot') && property.plotSize ? property.plotSize : property.size}
            </div>
            <div className="text-xs text-blue-600 uppercase tracking-wide">
              {property.propertyType?.toLowerCase().startsWith('plot') ? 'm² Plot' : 'm² Built'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Small badges below the large ones */}
      <div className="flex flex-wrap gap-2 mb-6">
        {property.subtype && property.subtype.toLowerCase() !== 'other' && (
          <Badge variant="outline" className="bg-green-50 text-green-800 rounded-full">
            {property.subtype}
          </Badge>
        )}
        {property.pool === true && (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 rounded-full">
            Pool
          </Badge>
        )}
        {property.plotSize > 0 && (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 rounded-full">
            Plot {property.plotSize} m²
          </Badge>
        )}
        {/* Show property reference or ID, but not both to avoid duplicates */}
        {(property.propertyRef || property.id) && (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 rounded-full">
            {property.propertyRef ? `Ref. ${property.propertyRef}` : `ID: ${property.id}`}
          </Badge>
        )}
       </div>
      
      {/* Map Modal */}
      <PropertyMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        location={property.location}
        propertyTitle={property.title}
        area={property.area}
      />
    </>
  );
};

export default PropertyHeader;
