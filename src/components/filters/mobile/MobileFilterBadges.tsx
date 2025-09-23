
import React from 'react';
import { X } from 'lucide-react';
import { FilterValues } from '@/components/SearchFilters';
import { formatPrice } from '@/utils/filterFormatters';
import { getRoomDisplayText, normalizeRoomValue } from '@/utils/roomFilterHelpers';
import { bedroomOptions, bathroomOptions } from '@/components/filters/RoomOptions';
import { getPropertyTypeDisplay } from '@/utils/typeDisplayHelpers';
import { featureOptions } from '@/components/filters/FeatureOptions';

interface MobileFilterBadgesProps {
  tempFilters: FilterValues;
  onRemoveFilter: (filterName: keyof FilterValues, specificValue?: string) => void;
  onClearAllFilters: () => void;
}

const MobileFilterBadges = ({ 
  tempFilters, 
  onRemoveFilter, 
  onClearAllFilters 
}: MobileFilterBadgesProps) => {
  const badges = [];

  // Location badges
  if (tempFilters.location) {
    const locations = tempFilters.location
      .split(',')
      .filter(Boolean)
      .map(location => location.trim());
    
    locations.forEach(location => {
      if (location) {
        badges.push({
          key: `location-${location}`,
          label: location,
          onRemove: () => onRemoveFilter('location', location)
        });
      }
    });
  }

  // Property type badges - separate badge per selected type, no prefix
  if (tempFilters.type && tempFilters.type !== 'any') {
    const typeValues = Array.isArray(tempFilters.type)
      ? tempFilters.type
      : typeof tempFilters.type === 'string'
        ? tempFilters.type.split(',').filter(v => v && v !== 'any')
        : [];

    typeValues.forEach((t) => {
      const label = getPropertyTypeDisplay(t);
      badges.push({
        key: `type-${t}`,
        label,
        onRemove: () => onRemoveFilter('type', t)
      });
    });
  }

  // Bedrooms badges - separate badge for each selected value
  if (tempFilters.bedrooms && tempFilters.bedrooms !== 'any') {
    const bedroomValues = tempFilters.bedrooms.split(',').filter(v => v !== 'any');
    bedroomValues.forEach(value => {
      const option = bedroomOptions.find(opt => opt.value === value);
      const label = option ? option.label : value;
      badges.push({
        key: `bedrooms-${value}`,
        label: `${label} sovrum`,
        onRemove: () => onRemoveFilter('bedrooms', value)
      });
    });
  }

  // Bathrooms badges - separate badge for each selected value
  if (tempFilters.bathrooms && tempFilters.bathrooms !== 'any') {
    const bathroomValues = tempFilters.bathrooms.split(',').filter(v => v !== 'any');
    bathroomValues.forEach(value => {
      const option = bathroomOptions.find(opt => opt.value === value);
      const label = option ? option.label : value;
      badges.push({
        key: `bathrooms-${value}`,
        label: `${label} badrum`,
        onRemove: () => onRemoveFilter('bathrooms', value)
      });
    });
  }

  // Price badge
  const hasCustomPriceFilter = tempFilters.minPrice > 0 || tempFilters.maxPrice < 5000000;
  if (hasCustomPriceFilter) {
    badges.push({
      key: 'price',
      label: `Price: ${formatPrice(tempFilters.minPrice)} - ${formatPrice(tempFilters.maxPrice)}`,
      onRemove: () => onRemoveFilter('minPrice')
    });
  }

  // Feature badges
  featureOptions.forEach(feature => {
    if (tempFilters[feature.key as keyof FilterValues]) {
      badges.push({
        key: feature.key,
        label: feature.label,
        onRemove: () => onRemoveFilter(feature.key as keyof FilterValues)
      });
    }
  });

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="p-4 border-b border-navy-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white">Active Filters</h3>
        {badges.length > 1 && (
          <button
            onClick={onClearAllFilters}
            className="text-xs text-costa-400 hover:text-costa-300"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <div
            key={badge.key}
            className="flex items-center gap-1 bg-costa-600 text-white px-2 py-1 rounded-md text-xs"
          >
            <span>{badge.label}</span>
            <button
              onClick={badge.onRemove}
              className="ml-1 hover:bg-costa-700 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileFilterBadges;
