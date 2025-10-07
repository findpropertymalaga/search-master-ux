
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';

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
  const { t } = useTranslation();
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700">{t('sortBy')}</span>
      <Select value={sortOrder} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('selectSorting')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="published">{t('recentlyUpdated')}</SelectItem>
          <SelectItem value="price-asc">{t('priceLowToHigh')}</SelectItem>
          <SelectItem value="price-desc">{t('priceHighToLow')}</SelectItem>
          <SelectItem value="size-asc">{t('sizeSmallToLarge')}</SelectItem>
          <SelectItem value="size-desc">{t('sizeLargeToSmall')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PropertySorting;
