
import React from 'react';
import { Button } from '@/components/ui/button';

interface MobileFilterActionsProps {
  totalCount: number;
  onApplyFilters: () => void;
}

const MobileFilterActions = ({
  totalCount,
  onApplyFilters
}: MobileFilterActionsProps) => {
  return (
    <div className="p-4 border-t border-navy-700">
      <Button
        onClick={onApplyFilters}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Uppdatera listvy ({totalCount})
      </Button>
    </div>
  );
};

export default MobileFilterActions;
