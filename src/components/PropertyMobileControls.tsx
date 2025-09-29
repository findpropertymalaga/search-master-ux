import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import PropertyMobileFilters from '@/components/PropertyMobileFilters';
import { FilterValues } from '@/components/SearchFilters';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

interface PropertyMobileControlsProps {
  sortOrder: SortOption;
  onSortChange: (order: SortOption) => void;
  showMap: boolean;
  onToggleMap: () => void;
  isFullscreenMap: boolean;
  onToggleFullscreen: () => void;
  currentFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  totalCount: number;
  isRentalPage?: boolean;
}

const PropertyMobileControls = ({
  sortOrder,
  onSortChange,
  showMap,
  onToggleMap,
  isFullscreenMap,
  onToggleFullscreen,
  currentFilters,
  onFilterChange,
  totalCount,
  isRentalPage = false
}: PropertyMobileControlsProps) => {
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SortOption | null>(null);

  const sortOptions = [
    { value: 'published' as const, label: 'Recently updated' },
    { value: 'price-asc' as const, label: 'Price: Low to high' },
    { value: 'price-desc' as const, label: 'Price: High to low' },
    { value: 'size-asc' as const, label: 'Size: Small to large' },
    { value: 'size-desc' as const, label: 'Size: Large to small' },
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortOrder);
    return option?.label || 'Sort';
  };

  const getSortIcon = () => {
    // Show up arrow for high-to-low (descending) and down arrow for low-to-high (ascending)
    if (sortOrder.includes('-desc')) {
      return <ArrowUp className="h-5 w-5" />;
    } else if (sortOrder.includes('-asc')) {
      return <ArrowDown className="h-5 w-5" />;
    }
    // Default sort icon for 'published' or other cases
    return (
      <div className="flex flex-col items-end">
        <span className="h-1 w-3 bg-navy-400 mb-0.5 rounded-full"></span>
        <span className="h-1 w-5 bg-navy-200 mb-0.5 rounded-full"></span>
        <span className="h-1 w-4 bg-navy-400 rounded-full"></span>
      </div>
    );
  };

  const handleSortSelect = (option: SortOption) => {
    setSelectedOption(option);
    onSortChange(option);
    
    // Delay closing by 1 second to show the selection
    setTimeout(() => {
      setSortDrawerOpen(false);
      setSelectedOption(null);
    }, 1000);
  };
  
  const handleMapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Map toggle clicked");
    onToggleMap();
  };
  
  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 bottom-4 flex shadow-lg rounded-full overflow-hidden z-[1001] bg-navy-900">
      {/* Filter Button */}
      <PropertyMobileFilters
        currentFilters={currentFilters}
        onFilterChange={onFilterChange}
        totalCount={totalCount}
        isRentalPage={isRentalPage}
      />

      {/* Sort Button with Drawer */}
      <Drawer open={sortDrawerOpen} onOpenChange={setSortDrawerOpen}>
        <DrawerTrigger asChild>
          <button 
            className={cn(
              "flex items-center justify-center gap-2 px-4 py-3 transition-colors border-r border-navy-700 text-white", 
              "hover:bg-navy-800 active:bg-navy-700"
            )}
            aria-label="Sort options"
          >
            {getSortIcon()}
          </button>
        </DrawerTrigger>
        <DrawerContent className="z-[1002] bg-navy-900">
          <DrawerHeader>
            {/* Removed DrawerTitle to leave it blank */}
          </DrawerHeader>
          <div className="px-4 pb-8">
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortOrder === option.value ? "default" : "outline"}
                  className={cn(
                    "w-full justify-start text-left transition-colors",
                    sortOrder === option.value 
                      ? "bg-navy-700 text-white hover:bg-navy-600 border-navy-600" 
                      : "bg-navy-800 text-navy-200 border-navy-600 hover:bg-navy-700 hover:text-white",
                    selectedOption === option.value && "bg-navy-600 scale-105"
                  )}
                  onClick={() => handleSortSelect(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Map Toggle Button */}
      <button
        onClick={handleMapClick}
        className={cn(
          "flex items-center justify-center px-4 py-3 transition-colors text-white", 
          showMap 
            ? "bg-costa-600 hover:bg-costa-700" 
            : "hover:bg-navy-800 active:bg-navy-700"
        )}
        aria-label={showMap ? "Hide map" : "Show map"}
      >
        <Map className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PropertyMobileControls;
