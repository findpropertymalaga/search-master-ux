
import { FilterValues } from '@/components/SearchFilters';
import { normalizeRoomValue } from './roomFilterHelpers';

export const parseNumericParam = (param: string | null, defaultValue: number): number => {
  if (!param) return defaultValue;
  const parsed = parseInt(param, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const createFilterParams = (filters: FilterValues): URLSearchParams => {
  const params = new URLSearchParams();
  
  if (filters.location && filters.location !== '') {
    params.set('location', filters.location);
  }
  
  if (filters.type && filters.type !== 'any') {
    const typeValue = Array.isArray(filters.type) ? filters.type.join(',') : filters.type;
    params.set('type', typeValue);
  }
  
  if (filters.minPrice && filters.minPrice > 0) {
    params.set('minPrice', filters.minPrice.toString());
  }
  
  if (filters.maxPrice && filters.maxPrice < 5000000) {
    params.set('maxPrice', filters.maxPrice.toString());
  }
  
  if (filters.bedrooms && filters.bedrooms !== 'any') {
    params.set('bedrooms', normalizeRoomValue(filters.bedrooms));
  }
  
  if (filters.bathrooms && filters.bathrooms !== 'any') {
    params.set('bathrooms', normalizeRoomValue(filters.bathrooms));
  }

  // Add the basic checkbox filters
  if (filters.has_pool) {
    params.set('has_pool', 'true');
  }
  
  if (filters.has_garden) {
    params.set('has_garden', 'true');
  }
  
  if (filters.has_garage) {
    params.set('has_garage', 'true');
  }

  // Add the advanced feature filters (legacy)
  const legacyFeatureKeys = [
    'covered_terrace', 'lift', 'fitted_wardrobes', 'near_transport', 'private_terrace',
    'gym', 'sauna', 'games_room', 'paddle_tennis', 'tennis_court', 'storage_room',
    'utility_room', 'ensuite_bathroom', 'accessibility', 'double_glazing', 'fiber_optic',
    'solarium', 'guest_apartment', 'jacuzzi', 'bar', 'barbeque', 'domotics', 'basement'
  ];

  legacyFeatureKeys.forEach(key => {
    if (filters[key as keyof FilterValues]) {
      params.set(key, 'true');
    }
  });

  // Add the new feature filters with URL-safe encoding
  const newFeatureKeys = [
    'Features - Private Terrace', 'Climate Control - Air Conditioning', 'Kitchen - Fully Fitted',
    'Features - Fitted Wardrobes', 'Setting - Close To Shops', 'Features - Covered Terrace',
    'Setting - Close To Schools', 'Orientation - South', 'Views - Sea', 'Condition - Excellent',
    'Utilities - Electricity', 'Views - Mountain', 'Setting - Close To Sea', 'Pool - Communal',
    'Pool - Private', 'Security - Gated Complex', 'Setting - Close To Town', 'Features - Ensuite Bathroom',
    'Features - Storage Room', 'Features - Near Transport', 'Features - Double Glazing'
  ];

  // Helper function to encode feature keys for URL (using 4 underscores for dashes)
  const encodeFeatureKey = (key: string) => {
    return key.replace(/\s+/g, '_').replace(/-/g, '____');
  };

  newFeatureKeys.forEach(key => {
    if (filters[key as keyof FilterValues]) {
      const encodedKey = encodeFeatureKey(key);
      params.set(encodedKey, 'true');
    }
  });
  
  return params;
};
