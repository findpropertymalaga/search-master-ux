
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FilterValues } from '@/components/SearchFilters';
import { buildRentalPropertyCountQuery } from '@/utils/rentalPropertyQueryBuilder';

interface PropertyCounterProps {
  currentFilters: FilterValues;
  isLoading: boolean;
  isRentalPage?: boolean;
}

const PropertyCounter = ({ currentFilters, isLoading, isRentalPage = false }: PropertyCounterProps) => {
  const [propertyCount, setPropertyCount] = useState<number | null>(null);

  // Function to fetch property count based on current filters
  const fetchPropertyCount = async () => {
    try {
      let query;
      
      if (isRentalPage) {
        // Use the rental property count query builder for rental pages
        console.log('PropertyCounter: Using rental property count query');
        query = buildRentalPropertyCountQuery(currentFilters);
      } else {
        // Use resales_feed for sales properties
        console.log('PropertyCounter: Using sales property count query');
        query = (supabase as any).from('resales_feed').select('id', { count: 'exact', head: true });

        // Apply location filter for sales properties
        if (currentFilters.location && currentFilters.location.trim() && currentFilters.location !== 'any') {
          const locations = currentFilters.location.split(',').filter(Boolean).map(loc => loc.trim());
          console.log('PropertyCounter: Processing locations:', locations);
          if (locations.length === 1) {
            query = query.ilike('town', `%${locations[0]}%`);
          } else if (locations.length > 1) {
            const locationConditions = locations.map(loc => `town.ilike.%${loc}%`).join(',');
            query = query.or(locationConditions);
          }
        }

        if (currentFilters.type && currentFilters.type !== 'any') {
          if (currentFilters.type === 'apartment') {
            query = query.ilike('type', '%Apartment%');
          } else if (currentFilters.type === 'villa' || currentFilters.type === 'house') {
            query = query.ilike('type', '%House%');
          } else if (currentFilters.type === 'plot') {
            query = query.ilike('type', '%Plot%');
          } else if (currentFilters.type === 'commercial') {
            query = query.ilike('type', '%Commercial%');
          } else {
            const typeValue = Array.isArray(currentFilters.type) ? currentFilters.type[0] : currentFilters.type;
            query = query.eq('type', typeValue);
          }
        }

        // Apply price range filter with minimum €150,000 enforcement for sales properties
        const minimumPrice = Math.max(currentFilters.minPrice || 0, 150000);
        console.log('PropertyCounter: Applying min price filter (enforced minimum €150,000):', minimumPrice);
        query = query.gte('price', minimumPrice);
        
        if (currentFilters.maxPrice < 5000000) {
          query = query.lte('price', currentFilters.maxPrice);
        }

        if (currentFilters.bedrooms && currentFilters.bedrooms !== 'any') {
          query = query.gte('beds', parseInt(currentFilters.bedrooms));
        }

        if (currentFilters.bathrooms && currentFilters.bathrooms !== 'any') {
          query = query.gte('baths', parseInt(currentFilters.bathrooms));
        }
      }

      const { count, error } = await query;
      
      if (error) {
        console.error('Error fetching property count:', error);
        setPropertyCount(null);
      } else {
        setPropertyCount(count);
      }
    } catch (error) {
      console.error('Error fetching property count:', error);
      setPropertyCount(null);
    }
  };

  // Fetch count whenever filters change
  useEffect(() => {
    // Always fetch count to show total available properties, even with no filters applied
    fetchPropertyCount();
  }, [currentFilters]);

  if (isLoading) {
    return <span className="ml-2 h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />;
  }

  if (propertyCount !== null) {
    return <span className="ml-2 px-1.5 py-0.5 text-xs bg-white text-costa-800 rounded-full">{propertyCount}</span>;
  }

  return null;
};

export default PropertyCounter;
