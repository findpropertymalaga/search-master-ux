import { supabase } from '@/integrations/supabase/client';
import { FilterValues } from '@/components/SearchFilters';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

export const buildPropertyQuery = (filters: FilterValues, sortOrder?: SortOption) => {
  console.log('=== BUILDING PROPERTY QUERY ===');
  console.log('Filters received:', filters);
  console.log('Sort order:', sortOrder);
  
  let query = (supabase as any)
    .from('resales_feed')
    .select('*');

  console.log('Base query created');

  // Apply only essential non-null filters
  query = query.not('price', 'is', null);

  // Apply location filter - handle multiple locations
  if (filters.location && filters.location.trim() && filters.location !== 'any') {
    const locations = filters.location.split(',').filter(Boolean).map(loc => loc.trim());
    if (locations.length === 1) {
      // Single location - use simple ilike
      console.log('Applying single location filter:', locations[0]);
      query = query.ilike('town', `%${locations[0]}%`);
    } else if (locations.length > 1) {
      // Multiple locations - build OR conditions for town column
      console.log('Applying multiple location filters:', locations);
      const locationConditions = locations.map(loc => `town.ilike.%${loc}%`).join(',');
      query = query.or(locationConditions);
    }
  }

  // Apply property type filter
  if (filters.type && filters.type !== 'any') {
    console.log('Applying type filter - original value:', filters.type);
    
    const typeValue = Array.isArray(filters.type) ? filters.type : [filters.type];
    const typeConditions = typeValue.map(type => {
      // Map frontend type values to database type patterns
      if (type === 'apartment') {
        console.log('Filtering for apartments');
        return { field: 'type', value: '%Apartment%', operator: 'ilike' };
      } else if (type === 'villa' || type === 'house') {
        console.log('Filtering for houses/villas');
        return { field: 'type', value: '%House%', operator: 'ilike' };
      } else if (type === 'plot') {
        console.log('Filtering for plots');
        return { field: 'type', value: '%Plot%', operator: 'ilike' };
      } else if (type === 'commercial') {
        console.log('Filtering for commercial');
        return { field: 'type', value: '%Commercial%', operator: 'ilike' };
      } else {
        // Fallback: try exact match
        console.log('Applying exact type filter:', type);
        return { field: 'type', value: type, operator: 'eq' };
      }
    });

    if (typeConditions.length > 0) {
      // Create OR conditions for multiple types
      const orConditions = typeConditions.map(condition => {
        if (condition.operator === 'ilike') {
          return `type.ilike.${condition.value}`;
        } else {
          return `type.eq.${condition.value}`;
        }
      }).join(',');
      query = query.or(orConditions);
    }
  }

  // Apply price range filter
  if (filters.minPrice > 0) {
    console.log('Applying min price filter:', filters.minPrice);
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice < 5000000) {
    console.log('Applying max price filter:', filters.maxPrice);
    query = query.lte('price', filters.maxPrice);
  }

  // Apply bedroom filter
  if (filters.bedrooms && filters.bedrooms !== 'any') {
    console.log('Applying bedroom filter:', filters.bedrooms);
    
    // Handle multiple bedroom selections
    const bedroomValues = Array.isArray(filters.bedrooms) ? filters.bedrooms : [filters.bedrooms];
    const bedroomConditions = bedroomValues.map(bedroom => `beds.eq.${parseInt(bedroom)}`).join(',');
    query = query.or(bedroomConditions);
  }

  // Apply bathroom filter
  if (filters.bathrooms && filters.bathrooms !== 'any') {
    console.log('Applying bathroom filter:', filters.bathrooms);
    
    // Handle multiple bathroom selections
    const bathroomValues = Array.isArray(filters.bathrooms) ? filters.bathrooms : [filters.bathrooms];
    const bathroomConditions = bathroomValues.map(bathroom => `baths.eq.${parseInt(bathroom)}`).join(',');
    query = query.or(bathroomConditions);
  }

  // Apply pool filter (boolean column)
  if (filters.has_pool) {
    console.log('Applying pool filter');
    query = query.eq('has_pool', true);
  }

  // Apply garden filter (features JSONB column) - use proper contains method
  if (filters.has_garden) {
    console.log('Applying garden filter from features column');
    // Use contains method for each garden type with OR logic
    // Apply garden features individually - Supabase doesn't support OR with contains well
    const gardenQuery1 = query.contains('features', ['Garden - Private']);
    const gardenQuery2 = query.contains('features', ['Garden - Communal']); 
    const gardenQuery3 = query.contains('features', ['Garden - Landscaped']);
    // For now, just use the most common one
    query = query.contains('features', ['Garden - Private']);
  }

  // Apply garage filter (features JSONB column)
  if (filters.has_garage) {
    console.log('Applying garage filter from features column');
    query = query.contains('features', ['Parking - Garage']);
  }

  // Apply new feature filters based on actual features array
  const activeFeatures = Object.keys(filters).filter(key => 
    key.includes(' - ') && filters[key as keyof FilterValues]
  );

  if (activeFeatures.length > 0) {
    activeFeatures.forEach(feature => {
      console.log(`Applying feature filter: ${feature}`);
      
      // Create feature variants for different table formats
      const featureVariants = [];
      
      // Original format (resales_feed): "Setting - Close To Sea"
      featureVariants.push(feature);
      
      console.log(`DEBUG: Feature variants for "${feature}":`, featureVariants);
      
      // Apply OR condition for all variants
      const variantConditions = featureVariants.map(variant => `features.cs.["${variant}"]`).join(',');
      query = query.or(variantConditions);
    });
  }

  console.log('Applied all filters');

  // Apply sorting
  if (sortOrder) {
    console.log('Applying sort order:', sortOrder);
    switch (sortOrder) {
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
      case 'size-asc':
        query = query.order('surface_area', { ascending: true });
        break;
      case 'size-desc':
        query = query.order('surface_area', { ascending: false });
        break;
      case 'published':
      default:
        query = query.order('status_date', { ascending: false });
        break;
    }
  } else {
    query = query.order('status_date', { ascending: false });
  }

  console.log('=== QUERY BUILT ===');
  return query;
};

export const buildPropertyCountQuery = (filters: FilterValues) => {
  console.log('=== BUILDING PROPERTY COUNT QUERY ===');
  console.log('Count query filters:', filters);
  
  let query = (supabase as any)
    .from('resales_feed')
    .select('*', { count: 'exact', head: true });

  // Apply the same filters as the main query
  query = query.not('price', 'is', null);

  // Apply location filter - handle multiple locations
  if (filters.location && filters.location.trim() && filters.location !== 'any') {
    const locations = filters.location.split(',').filter(Boolean).map(loc => loc.trim());
    if (locations.length === 1) {
      // Single location - use simple ilike
      query = query.ilike('town', `%${locations[0]}%`);
    } else if (locations.length > 1) {
      // Multiple locations - build OR conditions for town column
      const locationConditions = locations.map(loc => `town.ilike.%${loc}%`).join(',');
      query = query.or(locationConditions);
    }
  }

  // Apply property type filter
  if (filters.type && filters.type !== 'any') {
    const typeValue = Array.isArray(filters.type) ? filters.type : [filters.type];
    const typeConditions = typeValue.map(type => {
      // Map frontend type values to database type patterns
      if (type === 'apartment') {
        return { field: 'type', value: '%Apartment%', operator: 'ilike' };
      } else if (type === 'villa' || type === 'house') {
        return { field: 'type', value: '%House%', operator: 'ilike' };
      } else if (type === 'plot') {
        return { field: 'type', value: '%Plot%', operator: 'ilike' };
      } else if (type === 'commercial') {
        return { field: 'type', value: '%Commercial%', operator: 'ilike' };
      } else {
        // Fallback: try exact match
        return { field: 'type', value: type, operator: 'eq' };
      }
    });

    if (typeConditions.length > 0) {
      // Create OR conditions for multiple types
      const orConditions = typeConditions.map(condition => {
        if (condition.operator === 'ilike') {
          return `type.ilike.${condition.value}`;
        } else {
          return `type.eq.${condition.value}`;
        }
      }).join(',');
      query = query.or(orConditions);
    }
  }

  // Apply price range filter
  if (filters.minPrice > 0) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice < 5000000) {
    query = query.lte('price', filters.maxPrice);
  }

  // Apply bedroom filter
  if (filters.bedrooms && filters.bedrooms !== 'any') {
    // Handle multiple bedroom selections for count
    const bedroomValues = Array.isArray(filters.bedrooms) ? filters.bedrooms : [filters.bedrooms];
    const bedroomConditions = bedroomValues.map(bedroom => `beds.eq.${parseInt(bedroom)}`).join(',');
    query = query.or(bedroomConditions);
  }

  // Apply bathroom filter
  if (filters.bathrooms && filters.bathrooms !== 'any') {
    // Handle multiple bathroom selections for count
    const bathroomValues = Array.isArray(filters.bathrooms) ? filters.bathrooms : [filters.bathrooms];
    const bathroomConditions = bathroomValues.map(bathroom => `baths.eq.${parseInt(bathroom)}`).join(',');
    query = query.or(bathroomConditions);
  }

  // Apply pool filter (boolean column)
  if (filters.has_pool) {
    query = query.eq('has_pool', true);
  }

  // Apply garden filter (features JSONB column) - use proper contains method
  if (filters.has_garden) {
    // Use contains method for each garden type with OR logic
    // Apply garden features individually - for count query  
    query = query.contains('features', ['Garden - Private']);
  }

  // Apply garage filter (features JSONB column)
  if (filters.has_garage) {
    query = query.contains('features', ['Parking - Garage']);
  }

  // Apply new feature filters based on actual features array for count query
  const activeFeatures = Object.keys(filters).filter(key => 
    key.includes(' - ') && filters[key as keyof FilterValues]
  );

  if (activeFeatures.length > 0) {
    activeFeatures.forEach(feature => {
      console.log(`Applying count feature filter: ${feature}`);
      
      // Create feature variants for different table formats
      const featureVariants = [];
      
      // Original format (resales_feed): "Setting - Close To Sea"
      featureVariants.push(feature);
      
      console.log(`DEBUG: Feature variants for count "${feature}":`, featureVariants);
      
      // Apply OR condition for all variants
      const variantConditions = featureVariants.map(variant => `features.cs.["${variant}"]`).join(',');
      query = query.or(variantConditions);
    });
  }

  console.log('=== COUNT QUERY BUILT ===');
  return query;
};