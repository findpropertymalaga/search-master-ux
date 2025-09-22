
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hasActiveFilters: boolean;
  children: React.ReactNode;
  badgesSection?: React.ReactNode;
  onDrawerClose?: () => void;
}

const MobileFilterDrawer = ({
  isOpen,
  onOpenChange,
  hasActiveFilters,
  children,
  badgesSection,
  onDrawerClose
}: MobileFilterDrawerProps) => {
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    // If drawer is closing and onDrawerClose is provided, call it
    if (!open && onDrawerClose) {
      onDrawerClose();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <button 
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-3 transition-colors text-white rounded-full",
            hasActiveFilters 
              ? "bg-costa-600 hover:bg-costa-700" 
              : "bg-navy-900 hover:bg-navy-800 active:bg-navy-700"
          )}
          aria-label="Filter options"
        >
          <Filter className="h-5 w-5" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="z-[1002] bg-navy-900 max-h-[85vh]">
        <DrawerHeader className="border-b border-navy-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Filter</h2>
          </div>
        </DrawerHeader>
        
        {badgesSection}
        
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFilterDrawer;
