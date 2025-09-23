
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FilterValues } from '@/components/SearchFilters';
import { featureOptions } from '@/components/filters/FeatureOptions';

interface MobileFeatureFilterProps {
  tempFilters: FilterValues;
  onFeatureChange: (featureKey: string, checked: boolean) => void;
}

const MobileFeatureFilter = ({ tempFilters, onFeatureChange }: MobileFeatureFilterProps) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-3">Egenskaper</h3>
      <div className="space-y-3">
        {featureOptions.map((feature) => {
          // Handle the new feature keys properly by accessing them as dynamic properties
          const isChecked = Boolean((tempFilters as any)[feature.key]);
          
          return (
            <div key={feature.key} className="flex items-center space-x-2">
              <Checkbox
                id={feature.key}
                checked={isChecked}
                onCheckedChange={(checked) => onFeatureChange(feature.key, !!checked)}
                className="border-navy-600 data-[state=checked]:bg-costa-600 data-[state=checked]:border-costa-600"
              />
              <label htmlFor={feature.key} className="text-sm text-white cursor-pointer">
                {feature.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileFeatureFilter;
