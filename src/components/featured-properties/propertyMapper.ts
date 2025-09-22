
import { Property } from '@/components/property/types';

// Helper function to extract first words from description for title fallback
const getDescriptionFallbackTitle = (description: string, maxWords: number = 8): string => {
  if (!description) return '';
  const words = description.trim().split(/\s+/);
  return words.slice(0, maxWords).join(' ');
};

// Map Supabase property to our Property interface
export const mapSupabaseProperty = (item: any): Property => {
  // Handle the case where surface_area might be stored as JSON
  let builtArea = 0;
  let plotArea = 0;
  
  if (item.surface_area) {
    if (typeof item.surface_area === 'object') {
      builtArea = item.surface_area.built || item.surface_area.indoor || 0;
      plotArea = item.surface_area.plot || item.surface_area.outdoor || 0;
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

  // Get description for potential title fallback
  const description = item.description_translated || item.description || item.summary_translated || '';
  
  // Generate title with description fallback
  const generateTitle = () => {
    if (item.development_name) return item.development_name;
    if (item.town) return item.town;
    if (item.area) return 'Property in ' + item.area;
    if (description) return getDescriptionFallbackTitle(description);
    return 'Property in Costa del Sol';
  };

  return {
    id: item.id?.toString() || item.property_id || 'unknown',
    title: generateTitle(),
    price: item.price || 0,
    location: item.town || item.area || '',
    area: item.area || item.town || '',
    bedrooms: item.beds || 0,
    bathrooms: item.baths || 0,
    size: builtArea,
    plotSize: plotArea,
    images: images,
    description,
    features: features,
    propertyType: item.property_id?.split('_')[0] || 'Unknown',
    coordinates: item.latitude && item.longitude ? {
      lat: parseFloat(item.latitude.toString()),
      lng: parseFloat(item.longitude.toString())
    } : undefined,
    yearBuilt: undefined,
    energyRating: undefined,
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
    // Legacy compatibility fields
    type: item.property_id?.split('_')[0] || 'Unknown',
    imageUrl: images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    latitude: item.latitude ? parseFloat(item.latitude.toString()) : undefined,
    longitude: item.longitude ? parseFloat(item.longitude.toString()) : undefined,
    listed_date: item.listed_date,
    status_date: item.status_date
  };
};
