
import { useState, useEffect } from 'react';
import { FilterValues } from '@/components/SearchFilters';
import PropertyCounter from './PropertyCounter';
import SearchButton from './SearchButton';
import ActiveFilters from '@/components/ActiveFilters';
import HeroLocationFilter from './filters/HeroLocationFilter';
import HeroTypeFilter from './filters/HeroTypeFilter';
import HeroRoomFilters from './filters/HeroRoomFilters';
import HeroPriceFilter from './filters/HeroPriceFilter';

interface HeroSearchFormProps {
  currentFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  onSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
  isRentalPage?: boolean;
}

const HeroSearchForm = ({ currentFilters, onFilterChange, onSearch, isLoading, isRentalPage = false }: HeroSearchFormProps) => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    currentFilters.location ? currentFilters.location.split(',').filter(Boolean) : []
  );

  // Update selected locations when filter changes
  useEffect(() => {
    const newLocations = currentFilters.location ? currentFilters.location.split(',').filter(Boolean) : [];
    setSelectedLocations(newLocations);
  }, [currentFilters.location]);

  const handleLocationToggle = (location: string) => {
    let newSelectedLocations: string[];
    
    if (selectedLocations.includes(location)) {
      newSelectedLocations = selectedLocations.filter(loc => loc !== location);
    } else {
      newSelectedLocations = [...selectedLocations, location];
    }
    
    setSelectedLocations(newSelectedLocations);
    onFilterChange({...currentFilters, location: newSelectedLocations.join(',')});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <form onSubmit={onSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          {/* Location Filter */}
          <HeroLocationFilter
            selectedLocations={selectedLocations}
            onLocationToggle={handleLocationToggle}
            isRentalPage={isRentalPage}
          />

          {/* Type Filter */}
          <HeroTypeFilter
            value={currentFilters.type}
            onChange={(value) => onFilterChange({...currentFilters, type: value})}
            isRentalPage={isRentalPage}
          />

          {/* Room Filters */}
          <HeroRoomFilters
            bedrooms={currentFilters.bedrooms}
            bathrooms={currentFilters.bathrooms}
            onBedroomsChange={(value) => onFilterChange({...currentFilters, bedrooms: value})}
            onBathroomsChange={(value) => onFilterChange({...currentFilters, bathrooms: value})}
          />

          {/* Price Filter */}
          <HeroPriceFilter
            minPrice={currentFilters.minPrice}
            maxPrice={currentFilters.maxPrice}
            onChange={(minPrice, maxPrice) => onFilterChange({...currentFilters, minPrice, maxPrice})}
          />
        </div>
        
        {/* Active filters */}
        <div className="mt-2">
          <ActiveFilters currentFilters={currentFilters} onFilterChange={onFilterChange} />
        </div>

        <div className="flex justify-end">
          <SearchButton isLoading={isLoading}>
            <PropertyCounter 
              currentFilters={currentFilters}
              isLoading={isLoading}
              isRentalPage={isRentalPage}
            />
          </SearchButton>
        </div>
      </form>
    </div>
  );
};

export default HeroSearchForm;
