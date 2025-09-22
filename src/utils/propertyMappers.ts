
import { Property } from '@/components/property/types';
import { getPropertyCoordinates } from '@/utils/areaCoordinates';

// Helper function to extract first words from description for title fallback
const getDescriptionFallbackTitle = (description: string, maxWords: number = 8): string => {
  if (!description) return '';
  const words = description.trim().split(/\s+/);
  return words.slice(0, maxWords).join(' ');
};

export const mapSupabaseProperty = (item: any): Property => {
  console.log('=== MAPPING SUPABASE PROPERTY ===');
  console.log('Raw item from database:', item);
  
  // Handle the case where surface_area might be stored as JSON
  let builtArea = 0;
  let plotArea = 0;
  
  if (item.surface_area) {
    if (typeof item.surface_area === 'object') {
      // Convert string values to numbers
      builtArea = parseFloat(item.surface_area.built) || 0;
      plotArea = parseFloat(item.surface_area.plot) || 0;
    } else if (typeof item.surface_area === 'number') {
      builtArea = item.surface_area;
    }
  }

  // Handle images - ensure it's an array
  let images: string[] = [];
  if (item.images) {
    if (Array.isArray(item.images)) {
      images = item.images;
    } else if (typeof item.images === 'string') {
      try {
        const parsed = JSON.parse(item.images);
        images = Array.isArray(parsed) ? parsed : [item.images];
      } catch {
        images = [item.images];
      }
    }
  }

  // Handle features - ensure it's an array
  let features: string[] = [];
  if (item.features) {
    if (Array.isArray(item.features)) {
      features = item.features;
    } else if (typeof item.features === 'string') {
      try {
        const parsed = JSON.parse(item.features);
        features = Array.isArray(parsed) ? parsed : [];
      } catch {
        features = [];
      }
    }
  }

  // Generate coordinates based on area first, then town as fallback if database coords are null
  let coordinates = undefined;
  let latitude = undefined;
  let longitude = undefined;

  // First check if we have valid coordinates from the database
  if (item.latitude && item.longitude) {
    coordinates = {
      lat: parseFloat(item.latitude.toString()),
      lng: parseFloat(item.longitude.toString())
    };
    latitude = parseFloat(item.latitude.toString());
    longitude = parseFloat(item.longitude.toString());
  } else {
    // If no database coordinates, try to get coordinates from area first
    if (item.area) {
      const areaCoords = getPropertyCoordinates(item.area);
      if (areaCoords) {
        coordinates = areaCoords;
        latitude = areaCoords.lat;
        longitude = areaCoords.lng;
        console.log(`Generated coordinates for area "${item.area}":`, areaCoords);
      }
    }
    
    // If no area coordinates found, try town as fallback
    if (!coordinates && item.town) {
      const townCoords = getPropertyCoordinates(item.town);
      if (townCoords) {
        coordinates = townCoords;
        latitude = townCoords.lat;
        longitude = townCoords.lng;
        console.log(`Generated coordinates for town "${item.town}":`, townCoords);
      }
    }
    
    // If still no coordinates, try town + " Centro" as fallback
    if (!coordinates && item.town) {
      const townCenterCoords = getPropertyCoordinates(item.town + ' Centro');
      if (townCenterCoords) {
        coordinates = townCenterCoords;
        latitude = townCenterCoords.lat;
        longitude = townCenterCoords.lng;
        console.log(`Generated coordinates for town center "${item.town} Centro":`, townCenterCoords);
      }
    }
  }

  // Get description for potential title fallback
  const description = item.description_translated || item.description || item.summary_translated || '';
  
  // Generate title with description fallback
  const generateTitle = () => {
    if (item.development_name) return item.development_name;
    if (item.area) return item.area;
    if (description) return getDescriptionFallbackTitle(description);
    return 'Property';
  };

  const mappedProperty: Property = {
    id: item.property_id || item.id?.toString() || 'unknown',
    title: generateTitle(),
    price: item.price || 0,
    location: item.town || item.area || 'Unknown Location',
    area: item.area || item.town || '',
    bedrooms: item.beds || 0,
    bathrooms: item.baths || 0,
    size: builtArea, // This will now be a number
    plotSize: plotArea,
    images: images,
    description,
    features: features,
    propertyType: item.type || 'Unknown',
    coordinates,
    yearBuilt: undefined, // Not available in resales_feed
    energyRating: undefined, // Not available in resales_feed
    parking: Boolean(item.has_garage),
    garden: Boolean(item.has_garden),
    pool: Boolean(item.has_pool),
    status: item.status || 'available',
    listedDate: item.listed_date ? new Date(item.listed_date).toISOString().split('T')[0] : undefined,
    currency: item.currency || 'EUR',
    province: item.province || '',
    town: item.town || '',
    urbanisation: item.urbanisation_name || '',
    developmentName: item.development_name || '',
    subtype: item.subtype || undefined,
    // Legacy compatibility fields
    type: item.type || 'Unknown',
    imageUrl: images.length > 0 ? images[0] : '',
    latitude,
    longitude,
    listed_date: item.listed_date,
    status_date: item.status_date
  };

  console.log('=== MAPPED PROPERTY RESULT ===');
  console.log('Mapped property:', mappedProperty);
  
  return mappedProperty;
};

// Export DetailedProperty for backward compatibility
export type { DetailedProperty } from '@/components/property/types';
