
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface MobileLocationFilterProps {
  availableLocations: string[];
  selectedLocations: string[];
  onLocationToggle: (location: string) => void;
  locationsLoaded: boolean;
}

const MobileLocationFilter = ({
  availableLocations,
  selectedLocations,
  onLocationToggle,
  locationsLoaded
}: MobileLocationFilterProps) => {
  if (!locationsLoaded) {
    return (
      <div>
        <h3 className="text-sm font-medium text-white mb-3">Location</h3>
        <div className="text-white text-sm">Loading locations...</div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-white mb-3">Location</h3>
      <div className="space-y-3">
        {availableLocations.map((location) => {
          const isChecked = selectedLocations.includes(location);
          return (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`location-${location}`}
                checked={isChecked}
                onCheckedChange={() => onLocationToggle(location)}
                className="border-navy-600 data-[state=checked]:bg-costa-600 data-[state=checked]:border-costa-600"
              />
              <label htmlFor={`location-${location}`} className="text-sm text-white cursor-pointer">
                {location}
              </label>
            </div>
          );
        })}
        {availableLocations.length === 0 && (
          <div className="text-white text-sm">No locations available</div>
        )}
      </div>
    </div>
  );
};

export default MobileLocationFilter;
