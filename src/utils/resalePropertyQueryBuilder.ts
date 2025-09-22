
import { supabase } from '@/integrations/supabase/client';
import { FilterValues } from '@/components/SearchFilters';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

export const buildResalePropertyQuery = (filters: FilterValues, sortOrder?: SortOption) => {
  console.log('=== BUILDING RESALE PROPERTY QUERY ===');
  console.log('Resale filters received:', filters);
  console.log('Resale sort order:', sortOrder);
  
  // Helper function to apply filters to queries
  const applyFiltersToQuery = (query: any) => {
    // Apply location filter - handle multiple comma-separated locations
    if (filters.location && filters.location.trim() && filters.location !== 'any') {
      console.log('Applying resale location filter:', filters.location);
      
      // Handle multiple locations separated by commas
      const locations = filters.location.split(',').map(loc => loc.trim()).filter(loc => loc.length > 0);
      
      if (locations.length === 1) {
        // Single location - use ilike for partial matching
        query = query.ilike('town', `%${locations[0]}%`);
      } else {
        // Multiple locations - use OR with ilike for each location
        const locationConditions = locations.map(loc => `town.ilike.%${loc}%`).join(',');
        query = query.or(locationConditions);
      }
    }

    // Apply property type filter
    if (filters.type && filters.type !== 'any') {
      console.log('Applying resale type filter - original value:', filters.type);
      
      const typeValue = Array.isArray(filters.type) ? filters.type : (typeof filters.type === 'string' ? filters.type.split(',').filter(Boolean) : [filters.type]);
      
      // Skip new-devs filter here as it's handled at query level
      const filteredTypes = typeValue.filter(type => type !== 'new-devs');
      
      if (filteredTypes.length > 0) {
        const typeConditions = filteredTypes.map(type => {
          // Map frontend type values to database type patterns
          if (type === 'apartment') {
            console.log('Filtering for resale apartments');
            return { field: 'type', value: '%Apartment%', operator: 'ilike' };
          } else if (type === 'villa' || type === 'house') {
            console.log('Filtering for resale houses/villas');
            return { field: 'type', value: '%House%', operator: 'ilike' };
          } else if (type === 'plot') {
            console.log('Filtering for resale plots');
            return { field: 'type', value: '%Plot%', operator: 'ilike' };
          } else if (type === 'commercial') {
            console.log('Filtering for resale commercial');
            return { field: 'type', value: '%Commercial%', operator: 'ilike' };
          } else {
            // Fallback: try exact match
            console.log('Applying exact resale type filter:', type);
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
    }

    // Apply price range filter with minimum €150,000 enforcement
    const minimumPrice = Math.max(filters.minPrice || 0, 150000);
    console.log('Applying resale min price filter (enforced minimum €150,000):', minimumPrice);
    query = query.gte('price', minimumPrice);
    
    if (filters.maxPrice < 5000000) {
      console.log('Applying resale max price filter:', filters.maxPrice);
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
      console.log('Applying resale pool filter');
      query = query.eq('has_pool', true);
    }

    // Apply garden filter (features JSONB column) - use OR with multiple contains
    if (filters.has_garden) {
      console.log('Applying resale garden filter from features column');
      query = query.contains('features', ['Garden - Private']);
    }

    // Apply garage filter (features JSONB column)
    if (filters.has_garage) {
      console.log('Applying resale garage filter from features column');
      query = query.contains('features', ['Parking - Garage']);
    }

    // Apply new feature filters based on actual features array
    const activeFeatures = Object.keys(filters).filter(key => 
      key.includes(' - ') && filters[key as keyof FilterValues]
    );

    if (activeFeatures.length > 0) {
      console.log('DEBUG: Active features found:', activeFeatures);
      activeFeatures.forEach(feature => {
        console.log(`DEBUG: Applying resale feature filter: ${feature}`);
        
        // Create feature variants for different table formats
        const featureVariants = [];
        
        // Original format (resales_feed): "Setting - Close To Sea"
        featureVariants.push(feature);
        
        // Rental format (resales_rentals): "Setting: Close To Sea" 
        const rentalFormat = feature.replace(' - ', ': ');
        featureVariants.push(rentalFormat);
        
        // New devs format (resales_new_devs): just the value part "Close To Sea"
        const parts = feature.split(' - ');
        if (parts.length === 2) {
          featureVariants.push(parts[1]);
        }
        
        // Special handling for specific features
        if (feature === 'Features - Private Terrace') {
          featureVariants.push('Private Terrace');
        }
        if (feature === 'Features - Covered Terrace') {
          featureVariants.push('Covered Terrace');
        }
        if (feature === 'Features - Fitted Wardrobes') {
          featureVariants.push('Fitted Wardrobes');
        }
        if (feature === 'Features - Storage Room') {
          featureVariants.push('Storage Room');
        }
        if (feature === 'Features - Ensuite Bathroom') {
          featureVariants.push('Ensuite Bathroom');
        }
        if (feature === 'Features - Near Transport') {
          featureVariants.push('Near Transport');
        }
        if (feature === 'Features - Double Glazing') {
          featureVariants.push('Double Glazing');
        }
        if (feature === 'Climate Control - Air Conditioning') {
          featureVariants.push('Climate Control: Air Conditioning');
        }
        if (feature === 'Kitchen - Fully Fitted') {
          featureVariants.push('Kitchen: Fully Fitted');
        }
        if (feature === 'Pool - Communal') {
          featureVariants.push('Pool: Communal');
        }
        if (feature === 'Pool - Private') {
          featureVariants.push('Pool: Private');
        }
        if (feature === 'Security - Gated Complex') {
          featureVariants.push('Security: Gated Complex');
        }
        
        console.log(`DEBUG: Feature variants for "${feature}":`, featureVariants);
        
        // Apply OR condition for all variants
        const variantConditions = featureVariants.map(variant => `features.cs.["${variant}"]`).join(',');
        query = query.or(variantConditions);
      });
    }
    
    return query;
  };
  
  // Check if user selected "new-devs" filter to only query resales_new_devs table
  const typeArray = Array.isArray(filters.type) ? filters.type : (typeof filters.type === 'string' ? filters.type.split(',').filter(Boolean) : []);
  const isNewDevsOnly = typeArray.length === 1 && typeArray[0] === 'new-devs';
  
  if (isNewDevsOnly) {
    console.log('New Devs filter selected - querying only resales_new_devs table');
    // Build query for resales_new_devs table only  
    let newDevsQuery = supabase
      .from('resales_new_devs')
      .select('*');
      
    // Apply filters to the new devs query before returning
    newDevsQuery = newDevsQuery.not('price', 'is', null);
    newDevsQuery = applyFiltersToQuery(newDevsQuery);
      
    console.log('New Devs base query created with filters applied');
    return {
      newResalesQuery: null,
      newDevsQuery: newDevsQuery
    };
  }
  
  // Build query for resales_feed table
  let newResalesQuery = (supabase as any)
    .from('resales_feed')
    .select('*');

  // Build query for resales_new_devs table  
  let newDevsQuery = supabase
    .from('resales_new_devs')
    .select('*');

  console.log('Resale base queries created for both tables');

  // Apply only essential non-null filters to both queries
  if (newResalesQuery) newResalesQuery = newResalesQuery.not('price', 'is', null);
  if (newDevsQuery) newDevsQuery = newDevsQuery.not('price', 'is', null);

  // Apply filters to both queries (if they exist)
  if (newResalesQuery) newResalesQuery = applyFiltersToQuery(newResalesQuery);
  if (newDevsQuery) newDevsQuery = applyFiltersToQuery(newDevsQuery);

  console.log('Applied all resale filters to both tables');

  // Apply sorting to both queries
  const applySorting = (query: any) => {
    if (sortOrder) {
      console.log('Applying resale sort order:', sortOrder);
      switch (sortOrder) {
        case 'price-asc':
          return query.order('price', { ascending: true });
        case 'price-desc':
          return query.order('price', { ascending: false });
        case 'size-asc':
          return query.order('surface_area', { ascending: true });
        case 'size-desc':
          return query.order('surface_area', { ascending: false });
        case 'published':
        default:
          // Use listed_date for consistency with client-side sorting
          return query.order('listed_date', { ascending: false });
      }
    } else {
      return query.order('listed_date', { ascending: false });
    }
  };

  if (newResalesQuery) newResalesQuery = applySorting(newResalesQuery);
  if (newDevsQuery) newDevsQuery = applySorting(newDevsQuery);

  console.log('=== RESALE QUERIES BUILT ===');
  console.log('New Resales Query:', newResalesQuery ? 'Active' : 'Null');
  console.log('New Devs Query:', newDevsQuery ? 'Active' : 'Null');
  
  // Return object with both queries for the service to handle
  return {
    newResalesQuery,
    newDevsQuery
  };
};

export const buildResalePropertyCountQuery = (filters: FilterValues) => {
  console.log('=== BUILDING RESALE PROPERTY COUNT QUERY ===');
  console.log('Resale count query filters:', filters);
  
  // Check if user selected "new-devs" filter to only query resales_new_devs table
  const typeArray = Array.isArray(filters.type) ? filters.type : (typeof filters.type === 'string' ? filters.type.split(',').filter(Boolean) : []);
  const isNewDevsOnly = typeArray.length === 1 && typeArray[0] === 'new-devs';
  
  if (isNewDevsOnly) {
    console.log('New Devs filter selected - counting only resales_new_devs table');
    let newDevsCountQuery = supabase
      .from('resales_new_devs')
      .select('*', { count: 'exact', head: true });
    
    // Apply filters to the count query as well  
    newDevsCountQuery = newDevsCountQuery.not('price', 'is', null);
    
    // Apply same filter logic for count query
    const applyCountFilters = (query: any) => {
      // Apply location filter - handle multiple comma-separated locations (same logic as main query)
      if (filters.location && filters.location.trim() && filters.location !== 'any') {
        const locations = filters.location.split(',').map(loc => loc.trim()).filter(loc => loc.length > 0);
        
        if (locations.length === 1) {
          query = query.ilike('town', `%${locations[0]}%`);
        } else {
          const locationConditions = locations.map(loc => `town.ilike.%${loc}%`).join(',');
          query = query.or(locationConditions);
        }
      }

      // Apply property type filter
      if (filters.type && filters.type !== 'any') {
        const typeValue = Array.isArray(filters.type) ? filters.type : (typeof filters.type === 'string' ? filters.type.split(',').filter(Boolean) : [filters.type]);
        // Skip new-devs filter here as it's handled at query level
        const filteredTypes = typeValue.filter(type => type !== 'new-devs');
        
        if (filteredTypes.length > 0) {
        const typeConditions = filteredTypes.map(type => {
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
      }

      // Apply price range filter with minimum €150,000 enforcement
      const minimumPrice = Math.max(filters.minPrice || 0, 150000);
      query = query.gte('price', minimumPrice);
      
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

      // Apply garden filter (features JSONB column) - use OR with multiple contains
      if (filters.has_garden) {
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
        console.log('DEBUG: Active features found for count query:', activeFeatures);
        activeFeatures.forEach(feature => {
          console.log(`DEBUG: Applying count feature filter: ${feature}`);
          
          // Create feature variants for different table formats (same as main query)
          const featureVariants = [];
          
          // Original format (resales_feed): "Setting - Close To Sea"
          featureVariants.push(feature);
          
          // Rental format (resales_rentals): "Setting: Close To Sea" 
          const rentalFormat = feature.replace(' - ', ': ');
          featureVariants.push(rentalFormat);
          
          // New devs format (resales_new_devs): just the value part "Close To Sea"
          const parts = feature.split(' - ');
          if (parts.length === 2) {
            featureVariants.push(parts[1]);
          }
          
          // Special handling for specific features
          if (feature === 'Features - Private Terrace') {
            featureVariants.push('Private Terrace');
          }
          if (feature === 'Features - Covered Terrace') {
            featureVariants.push('Covered Terrace');
          }
          if (feature === 'Features - Fitted Wardrobes') {
            featureVariants.push('Fitted Wardrobes');
          }
          if (feature === 'Features - Storage Room') {
            featureVariants.push('Storage Room');
          }
          if (feature === 'Features - Ensuite Bathroom') {
            featureVariants.push('Ensuite Bathroom');
          }
          if (feature === 'Features - Near Transport') {
            featureVariants.push('Near Transport');
          }
          if (feature === 'Features - Double Glazing') {
            featureVariants.push('Double Glazing');
          }
          if (feature === 'Climate Control - Air Conditioning') {
            featureVariants.push('Climate Control: Air Conditioning');
          }
          if (feature === 'Kitchen - Fully Fitted') {
            featureVariants.push('Kitchen: Fully Fitted');
          }
          if (feature === 'Pool - Communal') {
            featureVariants.push('Pool: Communal');
          }
          if (feature === 'Pool - Private') {
            featureVariants.push('Pool: Private');
          }
          if (feature === 'Security - Gated Complex') {
            featureVariants.push('Security: Gated Complex');
          }
          
          console.log(`DEBUG: Feature variants for count "${feature}":`, featureVariants);
          
          // Apply OR condition for all variants
          const variantConditions = featureVariants.map(variant => `features.cs.["${variant}"]`).join(',');
          query = query.or(variantConditions);
        });
      }
      
      return query;
    };
    
    newDevsCountQuery = applyCountFilters(newDevsCountQuery);
      
    return {
      newResalesCountQuery: null,
      newDevsCountQuery: newDevsCountQuery
    };
  }
  
  // Build count queries for both tables
  let newResalesCountQuery = (supabase as any)
    .from('resales_feed')
    .select('*', { count: 'exact', head: true });
    
  let newDevsCountQuery = supabase
    .from('resales_new_devs')
    .select('*', { count: 'exact', head: true });

  // Helper function to apply the same filters as the main query to both count queries
  const applyCountFilters = (query: any) => {
    query = query.not('price', 'is', null);

    // Apply location filter - handle multiple comma-separated locations (same logic as main query)
    if (filters.location && filters.location.trim() && filters.location !== 'any') {
      const locations = filters.location.split(',').map(loc => loc.trim()).filter(loc => loc.length > 0);
      
      if (locations.length === 1) {
        query = query.ilike('town', `%${locations[0]}%`);
      } else {
        const locationConditions = locations.map(loc => `town.ilike.%${loc}%`).join(',');
        query = query.or(locationConditions);
      }
    }

    // Apply property type filter
    if (filters.type && filters.type !== 'any') {
      const typeValue = Array.isArray(filters.type) ? filters.type : (typeof filters.type === 'string' ? filters.type.split(',').filter(Boolean) : [filters.type]);
      // Skip new-devs filter here as it's handled at query level
      const filteredTypes = typeValue.filter(type => type !== 'new-devs');
      
      if (filteredTypes.length > 0) {
      const typeConditions = filteredTypes.map(type => {
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
    }

    // Apply price range filter with minimum €150,000 enforcement
    const minimumPrice = Math.max(filters.minPrice || 0, 150000);
    query = query.gte('price', minimumPrice);
    
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

    // Apply garden filter (features JSONB column) - use OR with multiple contains
    if (filters.has_garden) {
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
      console.log('DEBUG: Active features found for count query:', activeFeatures);
      activeFeatures.forEach(feature => {
        console.log(`DEBUG: Applying count feature filter: ${feature}`);
        
        // Create feature variants for different table formats (same as main query)
        const featureVariants = [];
        
        // Original format (resales_feed): "Setting - Close To Sea"
        featureVariants.push(feature);
        
        // Rental format (resales_rentals): "Setting: Close To Sea" 
        const rentalFormat = feature.replace(' - ', ': ');
        featureVariants.push(rentalFormat);
        
        // New devs format (resales_new_devs): just the value part "Close To Sea"
        const parts = feature.split(' - ');
        if (parts.length === 2) {
          featureVariants.push(parts[1]);
        }
        
        // Special handling for specific features
        if (feature === 'Features - Private Terrace') {
          featureVariants.push('Private Terrace');
        }
        if (feature === 'Features - Covered Terrace') {
          featureVariants.push('Covered Terrace');
        }
        if (feature === 'Features - Fitted Wardrobes') {
          featureVariants.push('Fitted Wardrobes');
        }
        if (feature === 'Features - Storage Room') {
          featureVariants.push('Storage Room');
        }
        if (feature === 'Features - Ensuite Bathroom') {
          featureVariants.push('Ensuite Bathroom');
        }
        if (feature === 'Features - Near Transport') {
          featureVariants.push('Near Transport');
        }
        if (feature === 'Features - Double Glazing') {
          featureVariants.push('Double Glazing');
        }
        if (feature === 'Climate Control - Air Conditioning') {
          featureVariants.push('Climate Control: Air Conditioning');
        }
        if (feature === 'Kitchen - Fully Fitted') {
          featureVariants.push('Kitchen: Fully Fitted');
        }
        if (feature === 'Pool - Communal') {
          featureVariants.push('Pool: Communal');
        }
        if (feature === 'Pool - Private') {
          featureVariants.push('Pool: Private');
        }
        if (feature === 'Security - Gated Complex') {
          featureVariants.push('Security: Gated Complex');
        }
        
        console.log(`DEBUG: Feature variants for count "${feature}":`, featureVariants);
        
        // Apply OR condition for all variants
        const variantConditions = featureVariants.map(variant => `features.cs.["${variant}"]`).join(',');
        query = query.or(variantConditions);
      });
    }
    
    return query;
  };

  // Apply filters to both count queries (if they exist)
  if (newResalesCountQuery) newResalesCountQuery = applyCountFilters(newResalesCountQuery);
  if (newDevsCountQuery) newDevsCountQuery = applyCountFilters(newDevsCountQuery);

  console.log('=== RESALE COUNT QUERIES BUILT FOR BOTH TABLES ===');
  
  // Return object with both count queries for the service to handle
  return {
    newResalesCountQuery,
    newDevsCountQuery
  };
};
