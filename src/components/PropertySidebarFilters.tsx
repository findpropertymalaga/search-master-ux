
import { FilterValues } from '@/components/SearchFilters';
import LocationFilter from '@/components/filters/LocationFilter';
import TypeFilter from '@/components/filters/TypeFilter';
import MultipleSelectionFilter from '@/components/filters/MultipleSelectionFilter';
import PriceRangeInputFilter from '@/components/filters/PriceRangeInputFilter';
import FeatureCheckboxList from '@/components/filters/FeatureCheckboxList';
import { bedroomOptions, bathroomOptions } from '@/components/filters/RoomOptions';

interface PropertySidebarFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  currentFilters: FilterValues;
  isRentalPage?: boolean;
}

const PropertySidebarFilters = ({ onFilterChange, currentFilters, isRentalPage = false }: PropertySidebarFiltersProps) => {
  const handleFeatureChange = (featureKey: string, checked: boolean) => {
    onFilterChange({
      ...currentFilters,
      [featureKey]: checked
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="space-y-8">
        {/* Location Filter */}
        <LocationFilter
          value={currentFilters.location ? currentFilters.location.split(',').filter(Boolean) : []}
          onChange={(locations) => onFilterChange({...currentFilters, location: locations.join(',')})}
          isRentalPage={isRentalPage}
        />

        {/* Type Filter */}
        <TypeFilter
          value={currentFilters.type}
          onChange={(value) => onFilterChange({...currentFilters, type: value})}
          isRentalPage={isRentalPage}
        />

        {/* Bedrooms Filter */}
        <MultipleSelectionFilter
          label="Sovrum"
          value={currentFilters.bedrooms}
          options={bedroomOptions}
          onChange={(value) => onFilterChange({...currentFilters, bedrooms: value})}
        />

        {/* Bathrooms Filter */}
        <MultipleSelectionFilter
          label="Badrum"
          value={currentFilters.bathrooms}
          options={bathroomOptions}
          onChange={(value) => onFilterChange({...currentFilters, bathrooms: value})}
        />

        {/* Price Range Filter */}
        <PriceRangeInputFilter
          minPrice={currentFilters.minPrice}
          maxPrice={currentFilters.maxPrice}
          onChange={(minPrice, maxPrice) => onFilterChange({...currentFilters, minPrice, maxPrice})}
        />

        {/* Property Features */}
        <FeatureCheckboxList
          currentFilters={currentFilters}
          onFeatureChange={handleFeatureChange}
        />
      </div>
    </div>
  );
};

export default PropertySidebarFilters;
