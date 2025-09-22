import { supabase } from '@/integrations/supabase/client';
import { FilterValues } from '@/components/SearchFilters';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

export const buildRentalPropertyQuery = (filters: FilterValues, sortOrder: SortOption = 'published') => {
  console.log('=== BUILDING RENTAL PROPERTY QUERY ===');
  console.log('Filters received:', filters);
  console.log('Sort order:', sortOrder);

  let query = (supabase as any)
    .from('resales_rentals')
    .select('*');

  console.log('Base query created for resales_rentals table');

  // By default, exclude short-term properties (only show long-term rentals)
  query = query.gt('longterm', 0);
  console.log('Applied default filter: only long-term rentals (longterm > 0)');

  // By default, exclude properties with price less than 1000€
  query = query.gte('longterm', 1000);
  console.log('Applied default filter: minimum price 1000€ (longterm >= 1000)');

  // Only show properties with status_date no older than 45 days
  const fortyFiveDaysAgo = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
  query = query.gte('status_date', fortyFiveDaysAgo);
  console.log('Applied default filter: status_date no older than 45 days (status_date >= ' + fortyFiveDaysAgo + ')');

  // Apply location filter - search both area and town columns
  if (filters.location && filters.location.trim()) {
    const locations = filters.location.split(',').map(loc => loc.trim()).filter(Boolean);
    console.log('Applying location filter for rentals:', locations);
    console.log('Location filter type:', typeof filters.location, 'value:', filters.location);
    
    if (locations.length === 1) {
      console.log('Single location filter - searching both area and town:', `%${locations[0]}%`);
      // Search both area and town columns since area might be null
      query = query.or(`area.ilike.%${locations[0]}%,town.ilike.%${locations[0]}%`);
    } else if (locations.length > 1) {
      // Create conditions for both area and town for each location
      const locationConditions = locations.flatMap(location => [
        `area.ilike.%${location}%`,
        `town.ilike.%${location}%`
      ]).join(',');
      console.log('Multiple location filter - searching area and town:', locationConditions);
      query = query.or(locationConditions);
    }
  } else {
    console.log('No location filter applied - will show all rental properties');
  }


  // Apply type filter - check if property type contains the filter value
  if (filters.type && filters.type !== 'any') {
    console.log('Applying type filter for rentals:', filters.type);
    console.log('Type filter type:', typeof filters.type, 'value:', filters.type);
    
    // Handle both array and comma-separated string values
    const typeValue = Array.isArray(filters.type) 
      ? filters.type 
      : filters.type.split(',').map(t => t.trim()).filter(Boolean);
    
    const orConditions: string[] = [];
    
    typeValue.forEach(type => {
      const typeFilter = type.toLowerCase();
      
      if (typeFilter === 'apartment') {
        orConditions.push('type.ilike.%Apartment%');
      } else if (typeFilter === 'house') {
        // House type includes both Villa type properties and detached subtypes
        orConditions.push('type.eq.Villa');
      } else if (typeFilter === 'penthouse') {
        orConditions.push('subtype.ilike.%Penthouse%');
      } else if (typeFilter === 'ground-floor') {
        orConditions.push('subtype.ilike.%Ground Floor%');
      } else if (typeFilter === 'duplex') {
        orConditions.push('subtype.ilike.%Duplex%');
      } else if (typeFilter === 'commercial') {
        // Commercial should include restaurant, commercial premises, office
        orConditions.push('type.ilike.%Commercial%');
      }
    });

    if (orConditions.length > 0) {
      query = query.or(orConditions.join(','));
    }
  }

  // Apply price range filters
  if (filters.minPrice > 0) {
    console.log('Applying min price filter for rentals:', filters.minPrice);
    query = query.gte('price', filters.minPrice);
  }

  if (filters.maxPrice < 5000000) {
    console.log('Applying max price filter for rentals:', filters.maxPrice);
    query = query.lte('price', filters.maxPrice);
  }

  // Apply bedroom filter
  if (filters.bedrooms && filters.bedrooms !== 'any') {
    console.log('Applying bedroom filter for rentals:', filters.bedrooms);
    
    // Handle multiple bedroom selections (comma-separated)
    const bedroomValues = filters.bedrooms.split(',').filter(Boolean);
    const bedroomConditions = bedroomValues.map(bedroom => `beds.eq.${parseInt(bedroom)}`).join(',');
    query = query.or(bedroomConditions);
  }

  // Apply bathroom filter
  if (filters.bathrooms && filters.bathrooms !== 'any') {
    console.log('Applying bathroom filter for rentals:', filters.bathrooms);
    
    // Handle multiple bathroom selections (comma-separated)
    const bathroomValues = filters.bathrooms.split(',').filter(Boolean);
    const bathroomConditions = bathroomValues.map(bathroom => `baths.eq.${parseInt(bathroom)}`).join(',');
    query = query.or(bathroomConditions);
  }

  // Apply boolean feature filters
  if (filters.has_pool) {
    console.log('Applying pool filter for rentals');
    query = query.eq('has_pool', true);
  }

  if (filters.has_garden) {
    console.log('Applying garden filter for rentals');
    query = query.eq('has_garden', true);
  }

  if (filters.has_garage) {
    console.log('Applying garage filter for rentals');
    query = query.eq('has_garage', true);
  }

  // Apply JSONB feature filters
  const jsonbFeatures = [
    'covered_terrace', 'lift', 'fitted_wardrobes', 'near_transport',
    'private_terrace', 'gym', 'sauna', 'games_room', 'paddle_tennis',
    'tennis_court', 'storage_room', 'utility_room', 'ensuite_bathroom',
    'accessibility', 'double_glazing', 'fiber_optic', 'solarium',
    'guest_apartment', 'jacuzzi', 'bar', 'barbeque', 'domotics', 'basement'
  ];

  jsonbFeatures.forEach(feature => {
    if (filters[feature as keyof FilterValues]) {
      console.log(`Applying ${feature} filter for rentals`);
      query = query.contains('features', { [feature]: true });
    }
  });

  // Apply sorting
  switch (sortOrder) {
    case 'price-asc':
      console.log('Sorting rentals by longterm price ascending');
      query = query.order('longterm', { ascending: true });
      break;
    case 'price-desc':
      console.log('Sorting rentals by longterm price descending');
      query = query.order('longterm', { ascending: false });
      break;
    case 'size-asc':
      console.log('Sorting rentals by size ascending');
      query = query.order('surface_area', { ascending: true });
      break;
    case 'size-desc':
      console.log('Sorting rentals by size descending');
      query = query.order('surface_area', { ascending: false });
      break;
    case 'published':
    default:
      console.log('Sorting rentals by status date descending');
      query = query.order('status_date', { ascending: false });
      break;
  }

  console.log('=== RENTAL PROPERTY QUERY BUILT ===');
  return query;
};

export const buildRentalPropertyCountQuery = (filters: FilterValues) => {
  console.log('=== BUILDING RENTAL PROPERTY COUNT QUERY ===');
  
  let countQuery = (supabase as any)
    .from('resales_rentals')
    .select('*', { count: 'exact', head: true });

  // By default, exclude short-term properties (only show long-term rentals)
  countQuery = countQuery.gt('longterm', 0);
  console.log('Applied default filter to count query: only long-term rentals (longterm > 0)');

  // By default, exclude properties with price less than 1000€
  countQuery = countQuery.gte('longterm', 1000);
  console.log('Applied default filter to count query: minimum price 1000€ (longterm >= 1000)');

  // Only show properties with status_date no older than 45 days
  const fortyFiveDaysAgo = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
  countQuery = countQuery.gte('status_date', fortyFiveDaysAgo);
  console.log('Applied default filter to count query: status_date no older than 45 days (status_date >= ' + fortyFiveDaysAgo + ')');

  // Apply the same filters as the main query (excluding sorting)
  if (filters.location && filters.location.trim()) {
    const locations = filters.location.split(',').map(loc => loc.trim()).filter(Boolean);
    
    if (locations.length === 1) {
      // Search both area and town columns since area might be null
      countQuery = countQuery.or(`area.ilike.%${locations[0]}%,town.ilike.%${locations[0]}%`);
    } else if (locations.length > 1) {
      // Create conditions for both area and town for each location
      const locationConditions = locations.flatMap(location => [
        `area.ilike.%${location}%`,
        `town.ilike.%${location}%`
      ]).join(',');
      countQuery = countQuery.or(locationConditions);
    }
  }

  if (filters.type && filters.type !== 'any') {
    // Handle both array and comma-separated string values
    const typeValue = Array.isArray(filters.type) 
      ? filters.type 
      : filters.type.split(',').map(t => t.trim()).filter(Boolean);
    
    const orConditions: string[] = [];
    
    typeValue.forEach(type => {
      const typeFilter = type.toLowerCase();
      
      if (typeFilter === 'apartment') {
        orConditions.push('type.ilike.%Apartment%');
      } else if (typeFilter === 'house') {
        // House type includes both Villa type properties and detached subtypes
        orConditions.push('type.eq.Villa');
      } else if (typeFilter === 'penthouse') {
        orConditions.push('subtype.ilike.%Penthouse%');
      } else if (typeFilter === 'ground-floor') {
        orConditions.push('subtype.ilike.%Ground Floor%');
      } else if (typeFilter === 'duplex') {
        orConditions.push('subtype.ilike.%Duplex%');
      } else if (typeFilter === 'commercial') {
        // Commercial should include restaurant, commercial premises, office
        orConditions.push('type.ilike.%Commercial%');
      }
    });

    if (orConditions.length > 0) {
      countQuery = countQuery.or(orConditions.join(','));
    }
  }

  if (filters.minPrice > 0) {
    countQuery = countQuery.gte('price', filters.minPrice);
  }

  if (filters.maxPrice < 5000000) {
    countQuery = countQuery.lte('price', filters.maxPrice);
  }

  if (filters.bedrooms && filters.bedrooms !== 'any') {
    // Handle multiple bedroom selections (comma-separated)
    const bedroomValues = filters.bedrooms.split(',').filter(Boolean);
    const bedroomConditions = bedroomValues.map(bedroom => `beds.eq.${parseInt(bedroom)}`).join(',');
    countQuery = countQuery.or(bedroomConditions);
  }

  if (filters.bathrooms && filters.bathrooms !== 'any') {
    // Handle multiple bathroom selections (comma-separated)
    const bathroomValues = filters.bathrooms.split(',').filter(Boolean);
    const bathroomConditions = bathroomValues.map(bathroom => `baths.eq.${parseInt(bathroom)}`).join(',');
    countQuery = countQuery.or(bathroomConditions);
  }

  if (filters.has_pool) {
    countQuery = countQuery.eq('has_pool', true);
  }

  if (filters.has_garden) {
    countQuery = countQuery.eq('has_garden', true);
  }

  if (filters.has_garage) {
    countQuery = countQuery.eq('has_garage', true);
  }

  // Apply JSONB feature filters
  const jsonbFeatures = [
    'covered_terrace', 'lift', 'fitted_wardrobes', 'near_transport',
    'private_terrace', 'gym', 'sauna', 'games_room', 'paddle_tennis',
    'tennis_court', 'storage_room', 'utility_room', 'ensuite_bathroom',
    'accessibility', 'double_glazing', 'fiber_optic', 'solarium',
    'guest_apartment', 'jacuzzi', 'bar', 'barbeque', 'domotics', 'basement'
  ];

  jsonbFeatures.forEach(feature => {
    if (filters[feature as keyof FilterValues]) {
      countQuery = countQuery.contains('features', { [feature]: true });
    }
  });

  console.log('=== RENTAL PROPERTY COUNT QUERY BUILT ===');
  return countQuery;
};