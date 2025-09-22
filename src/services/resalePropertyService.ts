
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/components/property/types';
import { FilterValues } from '@/components/SearchFilters';
import { buildResalePropertyQuery, buildResalePropertyCountQuery } from '@/utils/resalePropertyQueryBuilder';
import { mapSupabaseProperty } from '@/utils/propertyMappers';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

// Transform database row to Property interface using the shared mapper
const transformToProperty = (row: any): Property => {
  return mapSupabaseProperty(row);
};

export const fetchResaleProperties = async (
  filters: FilterValues,
  page: number = 1,
  limit: number = 20,
  sortOrder: SortOption = 'published'
): Promise<{ properties: Property[]; totalCount: number; hasMore: boolean }> => {
  console.log('=== FETCHING RESALE PROPERTIES ===');
  console.log('Resale service parameters:', { filters, page, limit, sortOrder });

  try {
    // Build the main queries with pagination
    const { newResalesQuery, newDevsQuery } = buildResalePropertyQuery(filters, sortOrder);
    const offset = (page - 1) * limit;
    
    console.log('Query builder results:');
    console.log('- newResalesQuery exists:', !!newResalesQuery);
    console.log('- newDevsQuery exists:', !!newDevsQuery);
    console.log('Executing resale paginated queries with offset:', offset, 'limit:', limit);
    
    // Execute queries from both tables WITHOUT pagination first to sort properly
    const queries = [];
    if (newResalesQuery) {
      console.log('Adding newResalesQuery to execution (without pagination)');
      queries.push(newResalesQuery.limit(50000)); // Get all data first
    }
    if (newDevsQuery) {
      console.log('Adding newDevsQuery to execution (without pagination)');
      queries.push(newDevsQuery.limit(50000)); // Get all data first
    }

    console.log('Total queries to execute:', queries.length);
    const results = await Promise.all(queries);
    
    // Check for errors in any of the results
    for (const result of results) {
      if (result.error) {
        console.error('Resale properties query error:', result.error);
        throw result.error;
      }
    }

    // Combine data from executed queries
    const rawProperties = results.flatMap(result => result.data || []);

    console.log('Raw resale properties fetched from active tables:', rawProperties?.length || 0, 'results');

    // Transform raw data to Property objects
    let properties = rawProperties ? rawProperties.map(transformToProperty) : [];
    
    // Apply sorting to the combined results
    if (sortOrder && properties.length > 0) {
      console.log('Applying client-side sorting to combined results:', sortOrder);
      properties.sort((a, b) => {
        switch (sortOrder) {
          case 'price-asc':
            return (a.price || 0) - (b.price || 0);
          case 'price-desc':
            return (b.price || 0) - (a.price || 0);
          case 'size-asc':
            return (a.size || 0) - (b.size || 0);
          case 'size-desc':
            return (b.size || 0) - (a.size || 0);
          case 'published':
          default:
            // Enhanced date sorting - handle null dates better
            const dateA = a.listedDate ? new Date(a.listedDate).getTime() : (a.status_date ? new Date(a.status_date).getTime() : 0);
            const dateB = b.listedDate ? new Date(b.listedDate).getTime() : (b.status_date ? new Date(b.status_date).getTime() : 0);
            // Sort by most recent first, push null dates to end
            if (dateA === 0 && dateB === 0) return 0;
            if (dateA === 0) return 1;  // Push null dates to end
            if (dateB === 0) return -1; // Push null dates to end
            return dateB - dateA;
        }
      });
      
      // Debug: Log the first few sorted results to verify proper interleaving
      console.log('First 5 sorted properties by date:');
      properties.slice(0, 5).forEach((prop, idx) => {
        console.log(`${idx + 1}. ${prop.title} - Listed: ${prop.listedDate || 'N/A'} - Status: ${prop.status_date || 'N/A'}`);
      });
    }
    
    // Apply pagination to the sorted results
    const totalCount = properties.length;
    const startIndex = offset;
    const endIndex = offset + limit;
    properties = properties.slice(startIndex, endIndex);
    
    console.log('Applied pagination: showing', properties.length, 'of', totalCount, 'total results');
    
    // Since we're getting the total count from the combined results, we don't need separate count queries
    const hasMore = offset + limit < totalCount;

    console.log('Resale has more pages:', hasMore);
    console.log('=== RESALE PROPERTIES FETCH COMPLETE ===');

    return {
      properties,
      totalCount,
      hasMore
    };
  } catch (error) {
    console.error('Error in fetchResaleProperties service:', error);
    throw error;
  }
};

export const fetchAllResaleProperties = async (
  filters: FilterValues,
  sortOrder: SortOption = 'published'
): Promise<Property[]> => {
  console.log('=== FETCHING ALL RESALE PROPERTIES ===');
  console.log('Fetch all resale parameters:', { filters, sortOrder });

  try {
    const { newResalesQuery, newDevsQuery } = buildResalePropertyQuery(filters, sortOrder);
    
    console.log('Executing fetch all resale queries with high limit to get ALL properties');
    console.log('About to execute queries for all properties with limit 50000...');
    
    // Explicitly set a very high limit to get all properties (Supabase defaults to 1000)
    const queries = [];
    if (newResalesQuery) {
      queries.push(newResalesQuery.limit(50000));
    }
    if (newDevsQuery) {
      queries.push(newDevsQuery.limit(50000));
    }

    const results = await Promise.all(queries);
    
    // Check for errors in any of the results
    for (const result of results) {
      if (result.error) {
        console.error('Fetch all resale properties error:', result.error);
        throw result.error;
      }
    }

    // Combine data from executed queries
    const rawProperties = results.flatMap(result => result.data || []);

    console.log('All raw resale properties fetched from active tables:', rawProperties?.length || 0, 'results');
    
    // Transform raw data to Property objects
    const properties = rawProperties ? rawProperties.map(transformToProperty) : [];
    
    console.log('All transformed resale properties:', properties.length, 'results');
    console.log('=== FETCH ALL RESALE COMPLETE ===');

    return properties;
  } catch (error) {
    console.error('Error in fetchAllResaleProperties service:', error);
    throw error;
  }
};
