import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/components/property/types';
import { FilterValues } from '@/components/SearchFilters';
import { buildRentalPropertyQuery, buildRentalPropertyCountQuery } from '@/utils/rentalPropertyQueryBuilder';
import { getPropertyCoordinates } from '@/utils/areaCoordinates';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

// Transform database row to Property interface
const transformToProperty = (row: any): Property => {
  console.log('Transforming rental property:', row.property_id || row.id, 'title:', row.description);
  console.log('Subtype value from database:', row.subtype, 'type:', typeof row.subtype);
  
  // Generate coordinates based on area first, then town as fallback (same as regular properties)
  let coordinates = undefined;
  let latitude = undefined;
  let longitude = undefined;

  // First check if database already has coordinates
  if (row.latitude && row.longitude) {
    coordinates = {
      lat: parseFloat(row.latitude),
      lng: parseFloat(row.longitude)
    };
    latitude = parseFloat(row.latitude);
    longitude = parseFloat(row.longitude);
  } else {
    // Generate approximate coordinates based on area first
    if (row.area) {
      const areaCoords = getPropertyCoordinates(row.area);
      if (areaCoords) {
        coordinates = areaCoords;
        latitude = areaCoords.lat;
        longitude = areaCoords.lng;
      }
    }
    
    // If no area coordinates found, try town as fallback
    if (!coordinates && row.town) {
      const townCoords = getPropertyCoordinates(row.town);
      if (townCoords) {
        coordinates = townCoords;
        latitude = townCoords.lat;
        longitude = townCoords.lng;
      }
    }
    
    // If still no coordinates, try town + " Centro" as fallback
    if (!coordinates && row.town) {
      const townCenterCoords = getPropertyCoordinates(row.town + ' Centro');
      if (townCenterCoords) {
        coordinates = townCenterCoords;
        latitude = townCenterCoords.lat;
        longitude = townCenterCoords.lng;
      }
    }
  }
  
  return {
    id: row.property_id || row.id?.toString() || '',
    title: row.description || 'Rental Property',
    price: row.price || 0,
    location: row.town || '',
    area: row.area || '',
    bedrooms: row.beds || 0,
    bathrooms: row.baths || 0,
    size: typeof row.surface_area === 'object' ? row.surface_area?.built || 0 : row.surface_area || 0,
    plotSize: typeof row.surface_area === 'object' && row.surface_area?.plot > 0 ? row.surface_area.plot : undefined,
    terrace: typeof row.surface_area === 'object' && row.surface_area?.terrace > 0 ? row.surface_area.terrace : undefined,
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description || '',
    features: Array.isArray(row.features) ? row.features : [],
    propertyType: row.type || '',
    coordinates,
    parking: Boolean(row.has_garage),
    garden: Boolean(row.has_garden),
    pool: Boolean(row.has_pool),
    status: row.status || 'active',
    listedDate: row.listed_date,
    currency: row.currency || 'EUR',
    province: row.province || '',
    town: row.town || '',
    urbanisation: '',
    developmentName: '',
    subtype: row.subtype || undefined,
    // Rental-specific pricing
    shortterm_low: (() => {
      console.log('Raw shortterm_low value:', row.shortterm_low, 'type:', typeof row.shortterm_low);
      const result = (row.shortterm_low !== null && row.shortterm_low !== undefined && row.shortterm_low > 0) ? row.shortterm_low : undefined;
      console.log('Transformed shortterm_low result:', result);
      return result;
    })(),
    longterm: (() => {
      console.log('Raw longterm value:', row.longterm, 'type:', typeof row.longterm);
      const result = (row.longterm !== null && row.longterm !== undefined && row.longterm > 0) ? row.longterm : undefined;
      console.log('Transformed longterm result:', result);
      return result;
    })(),
    // Legacy fields for backward compatibility
    type: row.type,
    latitude,
    longitude,
    propertyRef: row.property_id || undefined,  // Set propertyRef to property_id for rentals
    listed_date: row.listed_date,
    status_date: row.status_date
  };
};

export const fetchRentalProperties = async (
  filters: FilterValues,
  page: number = 1,
  limit: number = 20,
  sortOrder: SortOption = 'published'
): Promise<{ properties: Property[]; totalCount: number; hasMore: boolean }> => {
  console.log('=== FETCHING RENTAL PROPERTIES ===');
  console.log('Rental service parameters:', { filters, page, limit, sortOrder });

  try {
    // Build the main query with pagination
    const query = buildRentalPropertyQuery(filters, sortOrder);
    const offset = (page - 1) * limit;
    
    console.log('Executing rental paginated query with offset:', offset, 'limit:', limit);
    console.log('About to execute query...');
    
    // Execute paginated query
    const { data: rawProperties, error: propertiesError } = await query
      .range(offset, offset + limit - 1);

    console.log('Query executed - Error:', propertiesError);
    console.log('Query executed - Data length:', rawProperties?.length || 0);

    if (propertiesError) {
      console.error('Rental properties query error:', propertiesError);
      throw propertiesError;
    }

    console.log('Raw rental properties fetched:', rawProperties?.length || 0, 'results');

    // Transform raw data to Property objects
    const properties = rawProperties ? rawProperties.map(transformToProperty) : [];
    
    console.log('Transformed rental properties:', properties.length, 'results');

    // Get total count using separate query
    const countQuery = buildRentalPropertyCountQuery(filters);
    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Rental count query error:', countError);
      throw countError;
    }

    console.log('Rental total count:', count);

    const totalCount = count || 0;
    const hasMore = offset + limit < totalCount;

    console.log('Rental has more pages:', hasMore);
    console.log('=== RENTAL PROPERTIES FETCH COMPLETE ===');

    return {
      properties,
      totalCount,
      hasMore
    };
  } catch (error) {
    console.error('Error in fetchRentalProperties service:', error);
    throw error;
  }
};

export const fetchAllRentalProperties = async (
  filters: FilterValues,
  sortOrder: SortOption = 'published'
): Promise<Property[]> => {
  console.log('=== FETCHING ALL RENTAL PROPERTIES ===');
  console.log('Fetch all rental parameters:', { filters, sortOrder });

  try {
    const query = buildRentalPropertyQuery(filters, sortOrder);
    
    console.log('Executing fetch all rental query with high limit to get ALL properties');
    console.log('About to execute query for all rental properties with limit 50000...');
    
    // Explicitly set a very high limit to get all properties (Supabase defaults to 1000)
    const { data: rawProperties, error } = await query.limit(50000);

    if (error) {
      console.error('Fetch all rental properties error:', error);
      throw error;
    }

    console.log('All raw rental properties fetched:', rawProperties?.length || 0, 'results');
    
    // Transform raw data to Property objects
    const properties = rawProperties ? rawProperties.map(transformToProperty) : [];
    
    console.log('All transformed rental properties:', properties.length, 'results');
    console.log('=== FETCH ALL RENTAL COMPLETE ===');

    return properties;
  } catch (error) {
    console.error('Error in fetchAllRentalProperties service:', error);
    throw error;
  }
};