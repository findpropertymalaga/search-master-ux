import React, { useState, useEffect, useCallback } from 'react';
import { FilterValues } from '@/components/SearchFilters';
import { supabase } from '@/integrations/supabase/client';
import { featureOptions } from '@/components/filters/FeatureOptions';
import { bedroomOptions, bathroomOptions } from '@/components/filters/RoomOptions';
import MobileFilterDrawer from '@/components/filters/mobile/MobileFilterDrawer';
import MobileFilterBadges from '@/components/filters/mobile/MobileFilterBadges';
import MobileLocationFilter from '@/components/filters/mobile/MobileLocationFilter';
import MobileRoomSelectionFilter from '@/components/filters/mobile/MobileRoomSelectionFilter';
import MobilePriceRangeFilter from '@/components/filters/mobile/MobilePriceRangeFilter';
import MobileFeatureFilter from '@/components/filters/mobile/MobileFeatureFilter';
import MobileFilterActions from '@/components/filters/mobile/MobileFilterActions';
import MobileTypeFilter from '@/components/filters/mobile/MobileTypeFilter';

interface PropertyMobileFiltersProps {
  currentFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  totalCount: number;
  isRentalPage?: boolean;
}

const formatNumberWithCommas = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parseNumberFromFormatted = (value: string) => {
  return parseInt(value.replace(/,/g, '')) || 0;
};

const PropertyMobileFilters = ({
  currentFilters,
  onFilterChange,
  totalCount,
  isRentalPage = false
}: PropertyMobileFiltersProps) => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [tempFilters, setTempFilters] = useState<FilterValues>(currentFilters);
  const [locationsLoaded, setLocationsLoaded] = useState(false);
  const [filteredCount, setFilteredCount] = useState(totalCount);

  // Price input states
  const [localMinPrice, setLocalMinPrice] = useState(
    tempFilters.minPrice === 0 ? '' : formatNumberWithCommas(tempFilters.minPrice.toString())
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    tempFilters.maxPrice === 5000000 ? '' : formatNumberWithCommas(tempFilters.maxPrice.toString())
  );

  // Fetch available locations from appropriate table based on page type
  const fetchLocations = useCallback(async () => {
    if (locationsLoaded) return;
    
    const tableName = isRentalPage ? 'resales_rentals' : 'resales_feed';
    console.log(`Fetching available locations from ${tableName}...`);
    try {
      const { data, error } = await (supabase as any)
        .from(tableName)
        .select('town')
        .not('town', 'is', null)
        .not('town', 'eq', '');
        
      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }
      
      // Extract unique locations and sort them
      const towns = [...new Set(data.map((item: any) => item.town))]
        .filter(Boolean)
        .sort() as string[];
        
      console.log(`Available locations loaded from ${tableName}:`, towns);
      setAvailableLocations(towns);
      setLocationsLoaded(true);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  }, [locationsLoaded, isRentalPage]);

  // Fetch filtered count based on tempFilters - using same logic as main query builder
  const fetchFilteredCount = useCallback(async () => {
    console.log('🔍 MOBILE FILTER COUNT: Starting count fetch for filters:', tempFilters);

    try {
      // Rentals keep existing single-table logic
      if (isRentalPage) {
        let query = (supabase as any)
          .from('resales_rentals')
          .select('*', { count: 'exact', head: true })
          .not('price', 'is', null);

        // Location (rentals support town or area)
        if (tempFilters.location && tempFilters.location.trim() && tempFilters.location !== 'any') {
          const locations = tempFilters.location.split(',').filter(Boolean).map(loc => loc.trim());
          if (locations.length === 1) {
            query = query.or(`town.ilike.%${locations[0]}%,area.ilike.%${locations[0]}%`);
          } else if (locations.length > 1) {
            const locationConditions = locations.flatMap(loc => [`town.ilike.%${loc}%`, `area.ilike.%${loc}%`]).join(',');
            query = query.or(locationConditions);
          }
        }

        // Type filter (no new-devs on rentals)
        if (tempFilters.type && tempFilters.type !== 'any') {
          const typeValues = (Array.isArray(tempFilters.type) ? tempFilters.type : tempFilters.type.split(',').filter(Boolean));
          const typeConditions = typeValues.map((t) => {
            if (t === 'apartment') return 'type.ilike.%Apartment%';
            if (t === 'villa' || t === 'house') return 'type.ilike.%House%';
            if (t === 'plot') return 'type.ilike.%Plot%';
            if (t === 'commercial') return 'type.ilike.%Commercial%';
            return `type.eq.${t}`;
          });
          if (typeConditions.length > 0) query = query.or(typeConditions.join(','));
        }

        // Price
        if (tempFilters.minPrice > 0) query = query.gte('price', tempFilters.minPrice);
        if (tempFilters.maxPrice < 5000000) query = query.lte('price', tempFilters.maxPrice);

        // Bedrooms/Bathrooms (gte like before)
        if (tempFilters.bedrooms && tempFilters.bedrooms !== 'any') {
          const bedroomValues = tempFilters.bedrooms.split(',').filter(v => v !== 'any');
          if (bedroomValues.length > 0) {
            const bedroomConditions = bedroomValues.map(v => {
              const n = parseInt(v); return !isNaN(n) ? `beds.gte.${n}` : null;
            }).filter(Boolean) as string[];
            if (bedroomConditions.length > 0) query = query.or(bedroomConditions.join(','));
          }
        }
        if (tempFilters.bathrooms && tempFilters.bathrooms !== 'any') {
          const bathroomValues = tempFilters.bathrooms.split(',').filter(v => v !== 'any');
          if (bathroomValues.length > 0) {
            const bathroomConditions = bathroomValues.map(v => {
              const n = parseInt(v); return !isNaN(n) ? `baths.gte.${n}` : null;
            }).filter(Boolean) as string[];
            if (bathroomConditions.length > 0) query = query.or(bathroomConditions.join(','));
          }
        }

        if (tempFilters.has_pool) query = query.eq('has_pool', true);
        if (tempFilters.has_garden) query = query.or('features.cs.["Garden - Private"],features.cs.["Garden - Communal"],features.cs.["Garden - Landscaped"]');
        if (tempFilters.has_garage) query = query.contains('features', ['Parking - Garage']);

        // Feature variants for rentals
        const activeFeatures = Object.keys(tempFilters).filter(key => key.includes(' - ') && tempFilters[key as keyof FilterValues]);
        if (activeFeatures.length > 0) {
          activeFeatures.forEach(feature => {
            const featureVariants: string[] = [];
            featureVariants.push(feature); // feed format
            featureVariants.push(feature.replace(' - ', ': ')); // rentals format
            const parts = feature.split(' - ');
            if (parts.length === 2) featureVariants.push(parts[1]); // new-devs value only
            const variantConditions = featureVariants.map(variant => `features.cs.["${variant}"]`).join(',');
            query = query.or(variantConditions);
          });
        }

        const { count, error } = await query;
        if (error) {
          console.error('🔍 MOBILE FILTER COUNT (rentals): Error', error);
          return;
        }
        setFilteredCount(count || 0);
        return;
      }

      // Non-rentals: Always query both tables for complete count
      const typeValues = tempFilters.type && tempFilters.type !== 'any'
        ? (Array.isArray(tempFilters.type) ? tempFilters.type : tempFilters.type.split(',').filter(Boolean))
        : [];
      const includesNewDevs = typeValues.includes('new-devs');
      const otherTypes = typeValues.filter(t => t !== 'new-devs');
      
      // Always query both tables unless only "new-devs" is specifically selected
      const shouldQueryBothTables = typeValues.length === 0 || !includesNewDevs || otherTypes.length > 0;

      // Helper to apply filters to a query (for both tables)
      const applyFilters = (query: any) => {
        query = query.not('price', 'is', null);

        // Location (buy uses town only)
        if (tempFilters.location && tempFilters.location.trim() && tempFilters.location !== 'any') {
          const locations = tempFilters.location.split(',').filter(Boolean).map(loc => loc.trim());
          if (locations.length === 1) {
            query = query.ilike('town', `%${locations[0]}%`);
          } else if (locations.length > 1) {
            const locationConditions = locations.map(loc => `town.ilike.%${loc}%`).join(',');
            query = query.or(locationConditions);
          }
        }

        // Type filters (exclude new-devs here; handled at query selection)
        if (otherTypes.length > 0) {
          const typeConds = otherTypes.map((t) => {
            if (t === 'apartment') return 'type.ilike.%Apartment%';
            if (t === 'villa' || t === 'house') return 'type.ilike.%House%';
            if (t === 'plot') return 'type.ilike.%Plot%';
            if (t === 'commercial') return 'type.ilike.%Commercial%';
            return `type.eq.${t}`;
          });
          query = query.or(typeConds.join(','));
        }

        // Apply price range filter with minimum €150,000 enforcement for sales properties
        const minimumPrice = Math.max(tempFilters.minPrice || 0, 150000);
        query = query.gte('price', minimumPrice);
        if (tempFilters.maxPrice < 5000000) query = query.lte('price', tempFilters.maxPrice);

        if (tempFilters.bedrooms && tempFilters.bedrooms !== 'any') {
          const bedroomValues = tempFilters.bedrooms.split(',').filter(v => v !== 'any');
          if (bedroomValues.length > 0) {
            const bedroomConditions = bedroomValues.map(v => {
              const n = parseInt(v); return !isNaN(n) ? `beds.gte.${n}` : null;
            }).filter(Boolean) as string[];
            if (bedroomConditions.length > 0) query = query.or(bedroomConditions.join(','));
          }
        }
        if (tempFilters.bathrooms && tempFilters.bathrooms !== 'any') {
          const bathroomValues = tempFilters.bathrooms.split(',').filter(v => v !== 'any');
          if (bathroomValues.length > 0) {
            const bathroomConditions = bathroomValues.map(v => {
              const n = parseInt(v); return !isNaN(n) ? `baths.gte.${n}` : null;
            }).filter(Boolean) as string[];
            if (bathroomConditions.length > 0) query = query.or(bathroomConditions.join(','));
          }
        }

        if (tempFilters.has_pool) query = query.eq('has_pool', true);
        if (tempFilters.has_garden) query = query.or('features.cs.["Garden - Private"],features.cs.["Garden - Communal"],features.cs.["Garden - Landscaped"]');
        if (tempFilters.has_garage) query = query.contains('features', ['Parking - Garage']);

        // Feature variants across tables
        const activeFeatures = Object.keys(tempFilters).filter(key => key.includes(' - ') && tempFilters[key as keyof FilterValues]);
        if (activeFeatures.length > 0) {
          activeFeatures.forEach(feature => {
            const featureVariants: string[] = [];
            featureVariants.push(feature); // resales_feed
            featureVariants.push(feature.replace(' - ', ': ')); // rentals style
            const parts = feature.split(' - ');
            if (parts.length === 2) featureVariants.push(parts[1]); // new_devs value
            const variantConditions = featureVariants.map(variant => `features.cs.["${variant}"]`).join(',');
            query = query.or(variantConditions);
          });
        }

        return query;
      };

      if (shouldQueryBothTables) {
        // Query both tables to get complete count
        let newDevsQuery = (supabase as any)
          .from('resales_new_devs')
          .select('*', { count: 'exact', head: true });
        newDevsQuery = applyFilters(newDevsQuery);

        let resalesQuery = (supabase as any)
          .from('resales_feed')
          .select('*', { count: 'exact', head: true });
        resalesQuery = applyFilters(resalesQuery);

        // Execute in parallel
        const [newDevsRes, resalesRes] = await Promise.all([
          newDevsQuery,
          resalesQuery
        ]);

        if (newDevsRes.error || resalesRes.error) {
          console.error('🔍 MOBILE FILTER COUNT: Error fetching counts:', newDevsRes.error || resalesRes.error);
          return;
        }

        const total = (newDevsRes.count || 0) + (resalesRes.count || 0);
        console.log('🔍 MOBILE FILTER COUNT: Combined count from both tables:', total);
        setFilteredCount(total);
      } else if (includesNewDevs && otherTypes.length === 0) {
        // Only new-devs selected: query only resales_new_devs
        let newDevsQuery = (supabase as any)
          .from('resales_new_devs')
          .select('*', { count: 'exact', head: true });
        newDevsQuery = applyFilters(newDevsQuery);

        const { count, error } = await newDevsQuery;
        if (error) {
          console.error('🔍 MOBILE FILTER COUNT: Error fetching new-devs only count:', error);
          return;
        }
        console.log('🔍 MOBILE FILTER COUNT: New-devs only count:', count);
        setFilteredCount(count || 0);
      } else {
        // Fallback: query resales_feed only
        let query = (supabase as any)
          .from('resales_feed')
          .select('*', { count: 'exact', head: true });
        query = applyFilters(query);

        const { count, error } = await query;
        if (error) {
          console.error('🔍 MOBILE FILTER COUNT: Error fetching resales_feed count:', error);
          return;
        }
        console.log('🔍 MOBILE FILTER COUNT: Resales_feed only count:', count);
        setFilteredCount(count || 0);
      }
    } catch (error) {
      console.error('🔍 MOBILE FILTER COUNT: Failed to fetch filtered count:', error);
    }
  }, [tempFilters, isRentalPage]);

  // Load locations immediately on component mount
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    if (filterDrawerOpen) {
      fetchFilteredCount();
    }
  }, [tempFilters, filterDrawerOpen, fetchFilteredCount]);

  useEffect(() => {
    if (!filterDrawerOpen) {
      setTempFilters(currentFilters);
      setLocalMinPrice(
        currentFilters.minPrice === 0 ? '' : formatNumberWithCommas(currentFilters.minPrice.toString())
      );
      setLocalMaxPrice(
        currentFilters.maxPrice === 5000000 ? '' : formatNumberWithCommas(currentFilters.maxPrice.toString())
      );
      console.log('Updated temp filters to:', currentFilters);
    }
  }, [currentFilters, filterDrawerOpen]);

  const getSelectedLocations = () => {
    const locations = tempFilters.location ? tempFilters.location.split(',').filter(Boolean) : [];
    return locations;
  };

  const hasActiveFilters = () => {
    return tempFilters.location !== '' ||
           (tempFilters.type && tempFilters.type !== 'any') ||
           tempFilters.bedrooms !== 'any' ||
           tempFilters.bathrooms !== 'any' ||
           tempFilters.minPrice > 0 ||
           tempFilters.maxPrice < 5000000 ||
           featureOptions.some(feature => tempFilters[feature.key as keyof FilterValues]);
  };

  const handleLocationToggle = (location: string) => {
    const selectedLocations = getSelectedLocations();
    let newLocations: string[];
    
    if (selectedLocations.includes(location)) {
      newLocations = selectedLocations.filter(loc => loc !== location);
    } else {
      newLocations = [...selectedLocations, location];
    }
    
    const newLocationString = newLocations.join(',');
    console.log('Location toggle:', location, 'New locations:', newLocationString);
    
    setTempFilters(prev => ({
      ...prev,
      location: newLocationString
    }));
  };

  const handleBedroomChange = (bedrooms: string[]) => {
    console.log('Bedroom change:', bedrooms);
    setTempFilters(prev => ({
      ...prev,
      bedrooms: bedrooms.join(',')
    }));
  };

  const handleBathroomChange = (bathrooms: string[]) => {
    console.log('Bathroom change:', bathrooms);
    setTempFilters(prev => ({
      ...prev,
      bathrooms: bathrooms.join(',')
    }));
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberWithCommas(e.target.value);
    setLocalMinPrice(formatted);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberWithCommas(e.target.value);
    setLocalMaxPrice(formatted);
  };

  const handleFeatureChange = (featureKey: string, checked: boolean) => {
    console.log('🔍 MOBILE FEATURE CHANGE:', featureKey, checked);
    setTempFilters(prev => {
      const newFilters = {
        ...prev,
        [featureKey]: checked
      };
      console.log('🔍 MOBILE FEATURE CHANGE: New temp filters:', newFilters);
      return newFilters;
    });
  };

  const applyPriceChanges = () => {
    const min = localMinPrice ? parseNumberFromFormatted(localMinPrice) : 0;
    const max = localMaxPrice ? parseNumberFromFormatted(localMaxPrice) : 5000000;
    
    setTempFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
  };

  const handleDrawerClose = () => {
    console.log('Drawer closing, auto-applying filters:', tempFilters);
    const min = localMinPrice ? parseNumberFromFormatted(localMinPrice) : 0;
    const max = localMaxPrice ? parseNumberFromFormatted(localMaxPrice) : 5000000;
    
    const finalFilters = {
      ...tempFilters,
      minPrice: min,
      maxPrice: max
    };
    
    onFilterChange(finalFilters);
  };

  const applyFilters = () => {
    console.log('Applying filters:', tempFilters);
    onFilterChange(tempFilters);
    setFilterDrawerOpen(false);
  };

  const clearAllFilters = () => {
    console.log('Clearing all filters');
    const defaultFilters: FilterValues = {
      location: '',
      type: 'any',
      minPrice: 0,
      maxPrice: 5000000,
      bedrooms: 'any',
      bathrooms: 'any',
      has_pool: false,
      has_garden: false,
      has_garage: false,
      // Add all feature options from FeatureOptions.tsx
      ...Object.fromEntries(featureOptions.map(feature => [feature.key, false]))
    };
    setTempFilters(defaultFilters);
    setLocalMinPrice('');
    setLocalMaxPrice('');
  };

  const removeFilter = (filterName: keyof FilterValues, specificValue?: string) => {
    console.log("Removing filter:", filterName, specificValue);
    
    const newFilters = { ...tempFilters };
    
    if (filterName === 'location') {
      if (specificValue && tempFilters.location) {
        const locations = tempFilters.location.split(',');
        const updatedLocations = locations.filter(loc => loc.trim() !== specificValue.trim());
        newFilters.location = updatedLocations.join(',');
      } else {
        newFilters.location = '';
      }
    } else if (filterName === 'type') {
      const current = tempFilters.type as any;
      let values: string[] = [];
      if (Array.isArray(current)) {
        values = current;
      } else if (typeof current === 'string') {
        values = current.split(',').filter(Boolean);
      }

      if (specificValue) {
        const updated = values.filter(v => v !== specificValue && v !== 'any');
        newFilters.type = updated.length > 0 
          ? (Array.isArray(current) ? updated : updated.join(','))
          : 'any';
      } else {
        newFilters.type = 'any';
      }
    } else if (filterName === 'bedrooms') {
      if (specificValue) {
        const currentValues = tempFilters.bedrooms ? tempFilters.bedrooms.split(',') : [];
        const updatedValues = currentValues.filter(v => v !== specificValue);
        newFilters.bedrooms = updatedValues.length > 0 ? updatedValues.join(',') : 'any';
      } else {
        newFilters.bedrooms = 'any';
      }
    } else if (filterName === 'bathrooms') {
      if (specificValue) {
        const currentValues = tempFilters.bathrooms ? tempFilters.bathrooms.split(',') : [];
        const updatedValues = currentValues.filter(v => v !== specificValue);
        newFilters.bathrooms = updatedValues.length > 0 ? updatedValues.join(',') : 'any';
      } else {
        newFilters.bathrooms = 'any';
      }
    } else if (filterName === 'minPrice' || filterName === 'maxPrice') {
      newFilters.minPrice = 0;
      newFilters.maxPrice = 5000000;
      setLocalMinPrice('');
      setLocalMaxPrice('');
    } else {
      newFilters[filterName] = false;
    }
    
    setTempFilters(newFilters);
  };

  return (
    <MobileFilterDrawer
      isOpen={filterDrawerOpen}
      onOpenChange={setFilterDrawerOpen}
      hasActiveFilters={hasActiveFilters()}
      onDrawerClose={handleDrawerClose}
      badgesSection={
        <MobileFilterBadges
          tempFilters={tempFilters}
          onRemoveFilter={removeFilter}
          onClearAllFilters={clearAllFilters}
        />
      }
    >
      <MobileLocationFilter
        availableLocations={availableLocations}
        selectedLocations={getSelectedLocations()}
        onLocationToggle={handleLocationToggle}
        locationsLoaded={locationsLoaded}
      />

      <MobileTypeFilter
        value={tempFilters.type}
        onChange={(val) => setTempFilters((prev) => ({ ...prev, type: val }))}
        isRentalPage={isRentalPage}
      />

      <MobileRoomSelectionFilter
        title="Bedrooms"
        options={bedroomOptions}
        selectedValues={tempFilters.bedrooms ? tempFilters.bedrooms.split(',') : ['any']}
        onValueChange={handleBedroomChange}
      />

      <MobileRoomSelectionFilter
        title="Bathrooms"
        options={bathroomOptions}
        selectedValues={tempFilters.bathrooms ? tempFilters.bathrooms.split(',') : ['any']}
        onValueChange={handleBathroomChange}
      />

      <MobilePriceRangeFilter
        localMinPrice={localMinPrice}
        localMaxPrice={localMaxPrice}
        onMinPriceChange={handleMinPriceChange}
        onMaxPriceChange={handleMaxPriceChange}
        onApplyPriceChanges={applyPriceChanges}
      />

      <MobileFeatureFilter
        tempFilters={tempFilters}
        onFeatureChange={handleFeatureChange}
      />

      <MobileFilterActions
        totalCount={totalCount}
        onApplyFilters={applyFilters}
      />
    </MobileFilterDrawer>
  );
};

export default PropertyMobileFilters;
