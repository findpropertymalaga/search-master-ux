
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MobilePriceRangeFilterProps {
  localMinPrice: string;
  localMaxPrice: string;
  onMinPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyPriceChanges: () => void;
}

const MobilePriceRangeFilter = ({
  localMinPrice,
  localMaxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onApplyPriceChanges
}: MobilePriceRangeFilterProps) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-3">Price Range</h3>
      <div className="space-y-3">
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="From €"
              value={localMinPrice}
              onChange={onMinPriceChange}
              className="bg-navy-800 border-navy-600 text-white placeholder:text-navy-400 focus:border-costa-600"
            />
          </div>
          <span className="text-white font-medium">-</span>
          <div className="flex-1">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="To €"
              value={localMaxPrice}
              onChange={onMaxPriceChange}
              className="bg-navy-800 border-navy-600 text-white placeholder:text-navy-400 focus:border-costa-600"
            />
          </div>
        </div>
        <Button
          onClick={onApplyPriceChanges}
          className="w-full bg-costa-600 hover:bg-costa-700 text-white"
          size="sm"
        >
          Apply price range
        </Button>
      </div>
    </div>
  );
};

export default MobilePriceRangeFilter;
