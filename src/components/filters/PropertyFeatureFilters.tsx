
import { Checkbox } from '@/components/ui/checkbox';
import { FilterValues } from '@/components/SearchFilters';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PropertyFeatureFiltersProps {
  currentFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}

const PropertyFeatureFilters = ({ currentFilters, onFilterChange }: PropertyFeatureFiltersProps) => {
  const featureOptions = [
    { key: 'has_pool', label: 'Swimming Pool' },
    { key: 'private_pool', label: 'Private Pool' },
    { key: 'has_garden', label: 'Garden' },
    { key: 'has_garage', label: 'Garage' },
    { key: 'covered_terrace', label: 'Covered Terrace' },
    { key: 'lift', label: 'Lift' },
    { key: 'fitted_wardrobes', label: 'Fitted Wardrobes' },
    { key: 'near_transport', label: 'Near Transport' },
    { key: 'private_terrace', label: 'Private Terrace' },
    { key: 'gym', label: 'Gym' },
    { key: 'sauna', label: 'Sauna' },
    { key: 'games_room', label: 'Games Room' },
    { key: 'paddle_tennis', label: 'Paddle Tennis' },
    { key: 'tennis_court', label: 'Tennis Court' },
    { key: 'storage_room', label: 'Storage Room' },
    { key: 'utility_room', label: 'Utility Room' },
    { key: 'ensuite_bathroom', label: 'Ensuite Bathroom' },
    { key: 'accessibility', label: 'Access for people with reduced mobility' },
    { key: 'double_glazing', label: 'Double Glazing' },
    { key: 'fiber_optic', label: 'Fiber Optic' },
    { key: 'solarium', label: 'Solarium' },
    { key: 'guest_apartment', label: 'Guest Apartment' },
    { key: 'jacuzzi', label: 'Jacuzzi' },
    { key: 'bar', label: 'Bar' },
    { key: 'barbeque', label: 'Barbeque' },
    { key: 'domotics', label: 'Domotics' },
    { key: 'basement', label: 'Basement' },
  ];

  const handleFeatureChange = (featureKey: string, checked: boolean) => {
    onFilterChange({
      ...currentFilters,
      [featureKey]: checked
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-navy-800 mb-3">Fastighetsegenskaper</h3>
      
      <ScrollArea className="h-64">
        <div className="space-y-3 pr-3">
          {featureOptions.map((feature) => (
            <div key={feature.key} className="flex items-center space-x-2">
              <Checkbox
                id={feature.key}
                checked={!!currentFilters[feature.key as keyof FilterValues]}
                onCheckedChange={(checked) => handleFeatureChange(feature.key, !!checked)}
              />
              <label
                htmlFor={feature.key}
                className="text-sm font-medium text-navy-800 cursor-pointer leading-tight"
              >
                {feature.label}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PropertyFeatureFilters;
