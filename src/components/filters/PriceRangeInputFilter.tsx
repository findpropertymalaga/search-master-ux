
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PriceRangeInputFilterProps {
  minPrice: number;
  maxPrice: number;
  onChange: (minPrice: number, maxPrice: number) => void;
}

const PriceRangeInputFilter = ({ minPrice, maxPrice, onChange }: PriceRangeInputFilterProps) => {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice.toString());
  const [localMaxPrice, setLocalMaxPrice] = useState('');

  useEffect(() => {
    setLocalMinPrice(minPrice === 0 ? '' : minPrice.toString());
    setLocalMaxPrice(maxPrice === 5000000 ? '' : maxPrice.toString());
  }, [minPrice, maxPrice]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setLocalMinPrice(value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setLocalMaxPrice(value);
  };

  const formatPrice = (price: string) => {
    if (!price) return '';
    const num = parseInt(price);
    return new Intl.NumberFormat('en-US').format(num);
  };

  const applyPriceChanges = () => {
    const min = localMinPrice ? parseInt(localMinPrice) : 0;
    const max = localMaxPrice ? parseInt(localMaxPrice) : 5000000;
    onChange(min, max);
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-3 block">Price Range</label>
      <div className="space-y-3">
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="From €"
              value={localMinPrice ? formatPrice(localMinPrice) : ''}
              onChange={handleMinPriceChange}
              className="text-sm"
            />
          </div>
          <span className="text-gray-500 font-medium">-</span>
          <div className="flex-1">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="To €"
              value={localMaxPrice ? formatPrice(localMaxPrice) : ''}
              onChange={handleMaxPriceChange}
              className="text-sm"
            />
          </div>
        </div>
        <Button
          onClick={applyPriceChanges}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default PriceRangeInputFilter;
