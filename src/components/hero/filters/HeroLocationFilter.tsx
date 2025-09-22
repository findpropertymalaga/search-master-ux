
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

interface HeroLocationFilterProps {
  selectedLocations: string[];
  onLocationToggle: (location: string) => void;
  isRentalPage?: boolean;
}

const HeroLocationFilter = ({ selectedLocations, onLocationToggle, isRentalPage = false }: HeroLocationFilterProps) => {
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Determine which table to fetch from based on page type
        const tableName = isRentalPage ? 'resales_rentals' : 'resales_feed';
        
        const { data, error } = await (supabase as any)
          .from(tableName)
          .select('town')
          .not('town', 'is', null)
          .not('town', 'eq', '');
          
        if (error) {
          console.error('Error fetching locations:', error);
          return;
        }
        
        // Get unique locations and sort them
        const towns = [...new Set(data.map((item: any) => item.town))]
          .filter(Boolean)
          .sort() as string[];
          
        console.log(`Available locations from ${tableName}:`, towns);
        setAvailableLocations(towns);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };
    
    fetchLocations();
  }, [isRentalPage]);

  const getLocationDisplayText = () => {
    if (selectedLocations.length === 0) return "All locations";
    if (selectedLocations.length === 1) return selectedLocations[0];
    return `${selectedLocations.length} locations`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex h-12 w-full items-center justify-between rounded-md border-2 border-navy-800 bg-white px-3 py-2 text-navy-800 cursor-pointer hover:bg-gray-50">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-navy-800" />
            <span className="text-sm font-medium text-navy-800">
              {getLocationDisplayText()}
            </span>
          </div>
          <svg className="h-4 w-4 text-navy-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border-navy-800 z-50" sideOffset={4}>
        <ScrollArea className="h-60 w-full">
          <div className="p-1">
            {availableLocations.map((location) => (
              <DropdownMenuCheckboxItem
                key={location}
                checked={selectedLocations.includes(location)}
                onSelect={(e) => {
                  e.preventDefault();
                  onLocationToggle(location);
                }}
                className="text-navy-800 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
              >
                {location}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeroLocationFilter;
