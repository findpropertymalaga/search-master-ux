
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/components/property/types';
import { FilterValues } from '@/components/SearchFilters';
import { buildPropertyQuery, buildPropertyCountQuery } from '@/utils/propertyQueryBuilder';
import { getPropertyCoordinates } from '@/utils/areaCoordinates';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

// Transform database row to Property interface
const transformToProperty = (row: any): Property => {
  // Generate coordinates based on area first, then town as fallback
  let coordinates = undefined;
  let latitude = undefined;
  let longitude = undefined;

  // Try to get coordinates from area first
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

  return {
    id: row.property_id || row.id?.toString() || '',
    title: row.description_translated || row.description || 'Property',
    price: row.price || 0,
    location: row.town || '',
    area: row.area || '',
    bedrooms: row.beds || 0,
    bathrooms: row.baths || 0,
    size: typeof row.surface_area === 'object' ? row.surface_area?.built || 0 : row.surface_area || 0,
    plotSize: typeof row.surface_area === 'object' ? row.surface_area?.plot : undefined,
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description_translated || row.description || '',
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
    urbanisation: row.urbanisation_name || '',
    developmentName: row.development_name || '',
    // Legacy fields for backward compatibility
    type: row.type,
    imageUrl: Array.isArray(row.images) && row.images.length > 0 ? row.images : ['/placeholder.svg'],
    latitude,
    longitude,
    listed_date: row.listed_date,
    status_date: row.status_date
  };
};

export const fetchProperties = async (
  filters: FilterValues,
  page: number = 1,
  limit: number = 20,
  sortOrder: SortOption = 'published'
): Promise<{ properties: Property[]; totalCount: number; hasMore: boolean }> => {
  console.log('=== FETCHING PROPERTIES ===');
  console.log('Service parameters:', { filters, page, limit, sortOrder });

  try {
    // Build the main query with pagination
    const query = buildPropertyQuery(filters, sortOrder);
    const offset = (page - 1) * limit;
    
    console.log('Executing paginated query with offset:', offset, 'limit:', limit);
    
    // Execute paginated query
    const { data: rawProperties, error: propertiesError } = await query
      .range(offset, offset + limit - 1);

    if (propertiesError) {
      console.error('Properties query error:', propertiesError);
      throw propertiesError;
    }

    console.log('Raw properties fetched:', rawProperties?.length || 0, 'results');

    // Transform raw data to Property objects
    const properties = rawProperties ? rawProperties.map(transformToProperty) : [];
    
    console.log('Transformed properties:', properties.length, 'results');

    // Get total count using separate query
    const countQuery = buildPropertyCountQuery(filters);
    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Count query error:', countError);
      throw countError;
    }

    console.log('Total count:', count);

    const totalCount = count || 0;
    const hasMore = offset + limit < totalCount;

    console.log('Has more pages:', hasMore);
    console.log('=== PROPERTIES FETCH COMPLETE ===');

    return {
      properties,
      totalCount,
      hasMore
    };
  } catch (error) {
    console.error('Error in fetchProperties service:', error);
    throw error;
  }
};

export const fetchAllProperties = async (
  filters: FilterValues,
  sortOrder: SortOption = 'published'
): Promise<Property[]> => {
  console.log('=== FETCHING ALL PROPERTIES ===');
  console.log('Fetch all parameters:', { filters, sortOrder });

  try {
    const query = buildPropertyQuery(filters, sortOrder);
    
    console.log('Executing fetch all query');
    
    const { data: rawProperties, error } = await query;

    if (error) {
      console.error('Fetch all properties error:', error);
      throw error;
    }

    console.log('All raw properties fetched:', rawProperties?.length || 0, 'results');
    
    // Transform raw data to Property objects
    const properties = rawProperties ? rawProperties.map(transformToProperty) : [];
    
    // Debug: Log some coordinate mapping examples
    if (properties.length > 0) {
      const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude);
      const propertiesWithoutCoords = properties.filter(p => !p.latitude || !p.longitude);
      console.log(`Coordinates mapping: ${propertiesWithCoords.length} with coords, ${propertiesWithoutCoords.length} without coords`);
      
      if (propertiesWithoutCoords.length > 0) {
        console.log('Examples without coords:', propertiesWithoutCoords.slice(0, 3).map(p => ({
          id: p.id,
          town: (p as any).town,
          area: (p as any).area
        })));
      }
    }
    
    console.log('All transformed properties:', properties.length, 'results');
    console.log('=== FETCH ALL COMPLETE ===');

    return properties;
  } catch (error) {
    console.error('Error in fetchAllProperties service:', error);
    throw error;
  }
};
