
import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MapSearchButtonProps {
  onClick: () => void;
  onReset?: () => void;
  isFullscreen?: boolean;
  propertiesCount?: number;
  showRefineHint?: boolean;
  hasActiveFilter?: boolean;
  isMobile?: boolean;
}

const MapSearchButton = ({ 
  onClick, 
  onReset,
  isFullscreen = false, 
  propertiesCount = 0,
  showRefineHint = false,
  hasActiveFilter = false,
  isMobile = false
}: MapSearchButtonProps) => {
  return (
    <div className={cn(
      "absolute z-[1001] flex flex-col items-center space-y-2",
      isFullscreen 
        ? "top-4 left-1/2 transform -translate-x-1/2" 
        : "top-4 left-1/2 transform -translate-x-1/2"
    )}>
      <div className="relative">
        <Button
          onClick={onClick}
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-lg transition-all duration-200 flex items-center space-x-2 pr-3 font-medium"
          size="sm"
          variant="outline"
        >
          <Search className="h-4 w-4" />
          <span>Update list view{isMobile ? ` (${propertiesCount})` : ''}</span>
        </Button>
        
        {hasActiveFilter && onReset && !isMobile && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 bg-gray-500 hover:bg-gray-600 text-white rounded-full shadow-lg"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {showRefineHint && (
        <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border text-xs text-gray-600 max-w-xs text-center">
          Pan and zoom to refine your search area
        </div>
      )}
    </div>
  );
};

export default MapSearchButton;
