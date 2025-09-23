
import { useSearchFilters } from '@/hooks/useSearchFilters';
import LocationFilter from '@/components/filters/LocationFilter';
import RoomFilter from '@/components/filters/RoomFilter';
import PriceRangeFilter from '@/components/filters/PriceRangeFilter';
import { useEffect } from 'react';

export interface FilterValues {
  location: string; // Changed from string[] to string
  type: string | string[]; // Support both single string and array for multiple selection
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  bathrooms: string;
  has_pool: boolean;
  has_garden: boolean;
  has_garage: boolean;
  // New feature filters based on actual database features
  'Features - Private Terrace'?: boolean;
  'Climate Control - Air Conditioning'?: boolean;
  'Kitchen - Fully Fitted'?: boolean;
  'Features - Fitted Wardrobes'?: boolean;
  'Setting - Close To Shops'?: boolean;
  'Features - Covered Terrace'?: boolean;
  'Setting - Close To Schools'?: boolean;
  'Orientation - South'?: boolean;
  'Views - Sea'?: boolean;
  'Condition - Excellent'?: boolean;
  'Utilities - Electricity'?: boolean;
  'Views - Mountain'?: boolean;
  'Setting - Close To Sea'?: boolean;
  'Pool - Communal'?: boolean;
  'Pool - Private'?: boolean;
  'Security - Gated Complex'?: boolean;
  'Setting - Close To Town'?: boolean;
  'Features - Ensuite Bathroom'?: boolean;
  'Features - Storage Room'?: boolean;
  'Features - Near Transport'?: boolean;
  'Features - Double Glazing'?: boolean;
  // Legacy feature filters for backward compatibility
  covered_terrace?: boolean;
  lift?: boolean;
  fitted_wardrobes?: boolean;
  near_transport?: boolean;
  private_terrace?: boolean;
  gym?: boolean;
  sauna?: boolean;
  games_room?: boolean;
  paddle_tennis?: boolean;
  tennis_court?: boolean;
  storage_room?: boolean;
  utility_room?: boolean;
  ensuite_bathroom?: boolean;
  accessibility?: boolean;
  double_glazing?: boolean;
  fiber_optic?: boolean;
  solarium?: boolean;
  guest_apartment?: boolean;
  jacuzzi?: boolean;
  bar?: boolean;
  barbeque?: boolean;
  domotics?: boolean;
  basement?: boolean;
}

interface SearchFiltersProps {
  onFilter: (filters: FilterValues) => void;
  currentFilters: FilterValues;
  isHomePage?: boolean;
}

const SearchFilters = ({ onFilter, currentFilters, isHomePage = false }: SearchFiltersProps) => {
  const { 
    filters, 
    handleInputChange, 
    handleSelectChange, 
    handlePriceChange, 
    setLocationFilter 
  } = useSearchFilters(onFilter, currentFilters, isHomePage);
  
  // This effect ensures the internal filters state stays in sync with URL parameters
  useEffect(() => {
    console.log("SearchFilters received updated currentFilters:", currentFilters);
  }, [currentFilters]);

  return (
    <div className="bg-navy-800 p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <LocationFilter 
          value={filters.location ? filters.location.split(',').filter(Boolean) : []} 
          onChange={(locations) => setLocationFilter(locations.join(','))}
          isHomePage={isHomePage}
          triggerClassName="text-white border-navy-600 bg-navy-700"
        />

        <RoomFilter 
          label="Sovrum"
          value={filters.bedrooms} 
          onChange={(value) => handleSelectChange('bedrooms', value)}
        />

        <RoomFilter 
          label="Badrum"
          value={filters.bathrooms} 
          onChange={(value) => handleSelectChange('bathrooms', value)}
        />

        <PriceRangeFilter 
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={handlePriceChange}
        />
      </div>
    </div>
  );
};

export default SearchFilters;
