
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { FilterValues } from '@/components/SearchFilters';
import useActiveFilters from '@/hooks/useActiveFilters';

interface ActiveFiltersProps {
  currentFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}

/**
 * Component that displays active filters as badges with remove capability
 */
const ActiveFilters = ({ currentFilters, onFilterChange }: ActiveFiltersProps) => {
  const { activeFilters, clearAllFilters, filterBoxesKey } = useActiveFilters(currentFilters, onFilterChange);

  // If no active filters, don't render anything
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4" key={filterBoxesKey}>
      {activeFilters}
      {activeFilters.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllFilters}
          className="flex items-center gap-2 bg-white border-costa-300 text-costa-700 hover:bg-costa-50 text-xs relative pr-6"
        >
          Clear all filters
          <span className="absolute -top-1.5 -right-1.5 bg-costa-100 rounded-full p-0.5 hover:bg-costa-200">
            <X className="h-3 w-3" />
          </span>
        </Button>
      )}
    </div>
  );
};

export default ActiveFilters;
