
import { Slider } from '@/components/ui/slider';

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onChange: (value: number[]) => void;
}

const PriceRangeFilter = ({ minPrice, maxPrice, onChange }: PriceRangeFilterProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-1">
      <div className="flex justify-between">
        <label className="text-xs font-medium text-white">Price Range</label>
        <span className="text-xs text-navy-200">
          {formatPrice(minPrice)} - {formatPrice(maxPrice)}
        </span>
      </div>
      <Slider
        defaultValue={[minPrice, maxPrice]}
        value={[minPrice, maxPrice]}
        max={5000000}
        step={50000}
        onValueChange={onChange}
        className="mt-2"
      />
    </div>
  );
};

export default PriceRangeFilter;
