
import React from 'react';
import { Property } from '@/components/property/types';
import PropertyHeader from './PropertyHeader';
import PropertyDescription from './PropertyDescription';
import PropertyFeatures from './PropertyFeatures';
import PropertyDetailBadges from './PropertyDetailBadges';
import PropertyLocation from './PropertyLocation';

interface PropertyContentProps {
  property: Property;
}

const PropertyContent = ({ property }: PropertyContentProps) => {
  const formatPrice = (price: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (area: number | string) => {
    // Convert string to number if needed
    const numericArea = typeof area === 'string' ? parseFloat(area) : area;
    return isNaN(numericArea) ? '0' : numericArea.toLocaleString();
  };

  // Extract built area from surface_area or fall back to size
  const getBuiltArea = () => {
    // If property has surface_area with built value, use that
    if (property.size && typeof property.size === 'number') {
      return property.size;
    }
    return 0;
  };

  // Debug: Log rental pricing data for troubleshooting
  console.log('PropertyContent - Property data:', {
    id: property.id,
    shortterm_low: property.shortterm_low,
    longterm: property.longterm,
    price: property.price,
    title: property.title?.substring(0, 50)
  });

  return (
    <div className="space-y-6">
      <PropertyHeader property={property} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PropertyDescription description={property.description} />
          <PropertyFeatures features={property.features} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 sticky top-4">
            <div className="text-3xl font-bold text-costa-600 mb-4">
              {/* Show rental prices if available - prioritize longterm when both exist */}
              {(property.shortterm_low && property.shortterm_low > 0) || (property.longterm && property.longterm > 0) ? (
                <div>
                  {/* If both prices exist, show only longterm */}
                  {property.longterm && property.longterm > 0 && property.shortterm_low && property.shortterm_low > 0 ? (
                    <div className="text-2xl">{formatPrice(property.longterm, property.currency)} p/m</div>
                  ) : (
                    /* Otherwise, show whichever is available */
                    <>
                      {property.shortterm_low && property.shortterm_low > 0 && (
                        <div className="text-2xl">From {formatPrice(property.shortterm_low, property.currency)} p/w</div>
                      )}
                      {property.longterm && property.longterm > 0 && (
                        <div className="text-2xl">{formatPrice(property.longterm, property.currency)} p/m</div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                formatPrice(property.price, property.currency)
              )}
            </div>
            
            <PropertyDetailBadges 
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={getBuiltArea()}
              propertyType={property.propertyType}
              plotSize={property.plotSize}
            />
          </div>
          
          <PropertyLocation property={property} />
        </div>
      </div>
    </div>
  );
};

export default PropertyContent;
