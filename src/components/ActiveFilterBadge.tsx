
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ActiveFilterBadgeProps {
  label?: string;
  value: string;
  onRemove: () => void;
}

/**
 * Component for displaying an active filter as a removable badge
 */
const ActiveFilterBadge = ({ label, value, onRemove }: ActiveFilterBadgeProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onRemove}
      className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-800 text-xs relative pr-6 hover:bg-blue-100"
    >
      {label ? `${label}: ${value}` : value}
      <span className="absolute -top-1.5 -right-1.5 bg-blue-200 rounded-full p-0.5 hover:bg-blue-300">
        <X className="h-3 w-3" />
      </span>
    </Button>
  );
};

export default ActiveFilterBadge;
