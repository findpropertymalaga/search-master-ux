import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/utils/filterFormatters';
import { Property } from './types';

interface PropertyCardDetailsProps {
  property: Property;
  isSwipingDetected: boolean;
  isTouching: boolean;
}

export const PropertyCardDetails = ({ 
  property, 
  isSwipingDetected, 
  isTouching 
}: PropertyCardDetailsProps) => {
  // Debug: Log rental pricing data for troubleshooting
  console.log('PropertyCardDetails - Property data:', {
    id: property.id,
    shortterm_low: property.shortterm_low,
    longterm: property.longterm,
    price: property.price,
    title: property.title?.substring(0, 50)
  });
  
  // Don't render if property data is incomplete (loading state)
  if (!property.title || !property.id || property.title === 'Loading...' || property.id === 'loading') {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="flex gap-3 pt-4">
          <div className="h-12 bg-muted rounded-lg w-16" />
          <div className="h-12 bg-muted rounded-lg w-16" />
          <div className="h-12 bg-muted rounded-lg w-16" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded-full w-16" />
          <div className="h-6 bg-muted rounded-full w-20" />
        </div>
      </div>
    );
  }

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isSwipingDetected) {
      e.preventDefault();
      return;
    }
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <Link 
      to={`/properties/${property.id}`}
      className={isSwipingDetected ? 'pointer-events-none' : ''}
      onClick={handleLinkClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-serif font-medium text-lg line-clamp-1">{property.title}</h3>
          <div className="text-costa-700 font-medium">
            {/* Show rental prices if available - prioritize longterm when both exist */}
            {(property.shortterm_low && property.shortterm_low > 0) || (property.longterm && property.longterm > 0) ? (
              <div className="text-right">
                {/* If both prices exist, show only longterm */}
                {property.longterm && property.longterm > 0 && property.shortterm_low && property.shortterm_low > 0 ? (
                  <div className="text-sm">{formatPrice(property.longterm)} p/m</div>
                ) : (
                  /* Otherwise, show whichever is available */
                  <>
                    {property.shortterm_low && property.shortterm_low > 0 && (
                      <div className="text-sm">From {formatPrice(property.shortterm_low)} p/w</div>
                    )}
                    {property.longterm && property.longterm > 0 && (
                      <div className="text-sm">{formatPrice(property.longterm)} p/m</div>
                    )}
                  </>
                )}
              </div>
            ) : (
              property.price > 0 ? formatPrice(property.price) : ''
            )}
          </div>
        </div>
        
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0 text-costa-500" />
          <span className="truncate">{property.location}</span>
        </div>
        
        {/* Property Detail Badges - New blue design */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-800">{property.bedrooms}</div>
              <div className="text-xs text-blue-600 uppercase tracking-wide">Sängr</div>
            </div>
          </div>
          
          <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-800">{property.bathrooms}</div>
              <div className="text-xs text-blue-600 uppercase tracking-wide">Badrum</div>
            </div>
          </div>
          
          <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-800">
                {(() => {
                  const isPlot = property.propertyType?.toLowerCase().startsWith('plot');
                  const value = isPlot && property.plotSize ? property.plotSize : property.size;
                  return value > 0 ? value : '-';
                })()}
              </div>
              <div className="text-xs text-blue-600 uppercase tracking-wide">
                {property.propertyType?.toLowerCase().startsWith('plot') ? 'm² Tomt' : 'm² Byggd'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {property.subtype && property.subtype.toLowerCase() !== 'other' && (
            <Badge variant="outline" className="bg-green-50 text-green-800 rounded-full text-xs">
              {property.subtype}
            </Badge>
          )}
          {property.pool === true && (
            <Badge variant="outline" className="bg-blue-50 text-blue-800 rounded-full text-xs">
              Pool
            </Badge>
          )}
          {property.parking === true && (
            <Badge variant="outline" className="bg-blue-50 text-blue-800 rounded-full text-xs">
              Parking
            </Badge>
          )}
          {/* Show property reference or ID, but not both to avoid duplicates */}
          {(property.propertyRef || property.id) && (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 rounded-full text-xs">
              {property.propertyRef ? `Ref. ${property.propertyRef}` : `ID: ${property.id}`}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
};
