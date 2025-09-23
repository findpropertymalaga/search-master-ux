
import { Checkbox } from '@/components/ui/checkbox';
import { FilterValues } from '@/components/SearchFilters';
import { featureOptions } from './FeatureOptions';

interface FeatureCheckboxListProps {
  currentFilters: FilterValues;
  onFeatureChange: (featureKey: string, checked: boolean) => void;
}

const FeatureCheckboxList = ({ currentFilters, onFeatureChange }: FeatureCheckboxListProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-600 mb-3 block">Egenskaper</h3>
      <div className="space-y-3">
        {featureOptions.map((feature) => {
          // Handle the new feature keys properly by accessing them as dynamic properties
          const isChecked = Boolean((currentFilters as any)[feature.key]);
          
          return (
            <div key={feature.key} className="flex items-center space-x-2">
              <Checkbox
                id={feature.key}
                checked={isChecked}
                onCheckedChange={(checked) => onFeatureChange(feature.key, !!checked)}
                className="border-2 border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <label
                htmlFor={feature.key}
                className="text-sm font-medium text-gray-600 cursor-pointer leading-tight"
              >
                {feature.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureCheckboxList;
