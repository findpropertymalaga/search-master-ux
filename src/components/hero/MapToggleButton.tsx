
import { Map } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapToggleButtonProps {
  onToggle: () => void;
}

const MapToggleButton = ({ onToggle }: MapToggleButtonProps) => {
  return (
    <Button 
      onClick={onToggle}
      variant="outline"
      className="border-2 border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white bg-white"
    >
      <Map className="h-4 w-4 mr-2" />
      Switch to map view
    </Button>
  );
};

export default MapToggleButton;
