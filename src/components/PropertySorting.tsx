
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PropertySortingProps {
  sortOrder: string;
  onSortChange: (value: string) => void;
  className?: string;
  totalCount?: number;
  currentCount?: number;
  showMap?: boolean;
  onToggleMap?: () => void;
  isFullscreenMap?: boolean;
  onToggleFullscreen?: () => void;
}

const PropertySorting = ({ sortOrder, onSortChange, className = "" }: PropertySortingProps) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
      <Select value={sortOrder} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Choose sorting" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="published">Updated</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="size-asc">Size: Small to Large</SelectItem>
          <SelectItem value="size-desc">Size: Large to Small</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PropertySorting;
