
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

interface LocationFilterProps {
  value: string[];
  onChange: (locations: string[]) => void;
  isHomePage?: boolean;
  triggerClassName?: string;
  isRentalPage?: boolean;
}

const LocationFilter = ({ value, onChange, isHomePage = false, triggerClassName, isRentalPage = false }: LocationFilterProps) => {
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Determine which table to fetch from based on page type
        const tableName = isRentalPage ? 'resales_rentals' : 'resales_feed';
        
        const { data, error } = await (supabase as any)
          .from(tableName)
          .select('town')
          .not('town', 'is', null)
          .not('town', 'eq', '');
        
        if (error) throw error;
        
        // Extract unique locations and sort them
        const locations = [...new Set(data.map((item: any) => item.town))]
          .filter(Boolean)
          .sort() as string[];
        setAvailableLocations(locations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [isRentalPage]);

  const handleLocationToggle = (location: string) => {
    const updatedLocations = value.includes(location)
      ? value.filter(loc => loc !== location)
      : [...value, location];
    onChange(updatedLocations);
  };

  if (loading) {
    return (
      <div>
        <label className="text-sm font-medium text-gray-600 mb-3 block">Locations</label>
        <div className="text-gray-500 text-sm">Loading locations...</div>
      </div>
    );
  }

  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-3 block">Locations</label>
      <div className="space-y-3">
        {availableLocations.map((location) => {
          const isChecked = value.includes(location);
          return (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`location-${location}`}
                checked={isChecked}
                onCheckedChange={() => handleLocationToggle(location)}
              />
              <label htmlFor={`location-${location}`} className="text-sm text-gray-700 cursor-pointer">
                {location}
              </label>
            </div>
          );
        })}
        {availableLocations.length === 0 && (
          <div className="text-gray-500 text-sm">No locations available</div>
        )}
      </div>
    </div>
  );
};

export default LocationFilter;
