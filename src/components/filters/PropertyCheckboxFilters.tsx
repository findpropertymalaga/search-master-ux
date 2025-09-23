
import { Checkbox } from '@/components/ui/checkbox';
import { FilterValues } from '@/components/SearchFilters';

interface PropertyCheckboxFiltersProps {
  currentFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}

const PropertyCheckboxFilters = ({ currentFilters, onFilterChange }: PropertyCheckboxFiltersProps) => {
  const handleCheckboxChange = (field: keyof Pick<FilterValues, 'has_pool' | 'has_garden' | 'has_garage'>, checked: boolean) => {
    onFilterChange({
      ...currentFilters,
      [field]: checked
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-navy-800 mb-3">Fastighetsfunktioner</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="has_pool"
            checked={currentFilters.has_pool}
            onCheckedChange={(checked) => handleCheckboxChange('has_pool', !!checked)}
          />
          <label
            htmlFor="has_pool"
            className="text-sm font-medium text-navy-800 cursor-pointer"
          >
            Pool
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="has_garden"
            checked={currentFilters.has_garden}
            onCheckedChange={(checked) => handleCheckboxChange('has_garden', !!checked)}
          />
          <label
            htmlFor="has_garden"
            className="text-sm font-medium text-navy-800 cursor-pointer"
          >
            Trädgård
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="has_garage"
            checked={currentFilters.has_garage}
            onCheckedChange={(checked) => handleCheckboxChange('has_garage', !!checked)}
          />
          <label
            htmlFor="has_garage"
            className="text-sm font-medium text-navy-800 cursor-pointer"
          >
            Garage
          </label>
        </div>
      </div>
    </div>
  );
};

export default PropertyCheckboxFilters;
