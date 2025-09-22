
import { Euro } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HeroPriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onChange: (minPrice: number, maxPrice: number) => void;
}

const HeroPriceFilter = ({ minPrice, maxPrice, onChange }: HeroPriceFilterProps) => {
  const getPriceDisplayText = () => {
    if (minPrice === 0 && maxPrice === 5000000) {
      return "All prices";
    }
    if (minPrice === 0) {
      return `Up to €${(maxPrice / 1000).toFixed(0)}k`;
    }
    if (maxPrice === 5000000) {
      return `€${(minPrice / 1000).toFixed(0)}k+`;
    }
    return `€${(minPrice / 1000).toFixed(0)}k - €${(maxPrice / 1000).toFixed(0)}k`;
  };

  const handlePriceChange = (value: string) => {
    if (value === "any") {
      onChange(0, 5000000);
    } else if (value.includes("-")) {
      const [min, max] = value.split("-").map(Number);
      onChange(min, max);
    } else if (value.endsWith("+")) {
      const min = parseInt(value.replace("+", ""));
      onChange(min, 5000000);
    }
  };

  const getPriceValue = () => {
    if (minPrice === 0 && maxPrice === 5000000) {
      return "any";
    } else if (minPrice === 0) {
      return `0-${maxPrice}`;
    } else if (maxPrice === 5000000) {
      return `${minPrice}+`;
    } else {
      return `${minPrice}-${maxPrice}`;
    }
  };

  return (
    <Select value={getPriceValue()} onValueChange={handlePriceChange}>
      <SelectTrigger className="h-12 border-2 border-navy-800 bg-white text-navy-800 hover:bg-gray-50">
        <div className="flex items-center space-x-2 w-full">
          <Euro className="h-5 w-5 text-navy-800" />
          <span className="text-sm font-medium text-navy-800">
            {getPriceDisplayText()}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border-navy-800 z-50">
        <SelectItem value="any" className="text-navy-800">All prices</SelectItem>
        <SelectItem value="0-500000" className="text-navy-800">Up to €500,000</SelectItem>
        <SelectItem value="500000-1000000" className="text-navy-800">€500,000 - €1,000,000</SelectItem>
        <SelectItem value="1000000+" className="text-navy-800">€1,000,000+</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default HeroPriceFilter;
