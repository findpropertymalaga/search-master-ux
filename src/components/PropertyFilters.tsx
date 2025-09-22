import { FilterValues } from './SearchFilters';
import ActiveFilters from './ActiveFilters';
import { useState, useEffect } from 'react';
import { MapPin, BedDouble, Euro, Bath } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ScrollArea } from './ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  currentFilters: FilterValues;
}

const PropertyFilters = ({ onFilterChange, currentFilters }: PropertyFiltersProps) => {
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    currentFilters.location ? currentFilters.location.split(',').filter(Boolean) : []
  );

  // Fetch available locations from resales_feed table
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('resales_feed')
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
          
        console.log('Available locations from database:', towns);
        setAvailableLocations(towns);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };
    
    fetchLocations();
  }, []);

  // Update selected locations when filter changes
  useEffect(() => {
    const newLocations = currentFilters.location ? currentFilters.location.split(',').filter(Boolean) : [];
    setSelectedLocations(newLocations);
  }, [currentFilters.location]);

  const handleLocationToggle = (location: string) => {
    let newSelectedLocations: string[];
    
    if (selectedLocations.includes(location)) {
      newSelectedLocations = selectedLocations.filter(loc => loc !== location);
    } else {
      newSelectedLocations = [...selectedLocations, location];
    }
    
    setSelectedLocations(newSelectedLocations);
    onFilterChange({...currentFilters, location: newSelectedLocations.join(',')});
  };

  const getLocationDisplayText = () => {
    if (selectedLocations.length === 0) return "Location";
    if (selectedLocations.length === 1) return selectedLocations[0];
    return `${selectedLocations.length} locations`;
  };

  const getPriceDisplayText = () => {
    if (currentFilters.minPrice === 0 && currentFilters.maxPrice === 5000000) {
      return "Price";
    }
    if (currentFilters.minPrice === 0) {
      return `Up to €${(currentFilters.maxPrice / 1000).toFixed(0)}k`;
    }
    if (currentFilters.maxPrice === 5000000) {
      return `€${(currentFilters.minPrice / 1000).toFixed(0)}k+`;
    }
    return `€${(currentFilters.minPrice / 1000).toFixed(0)}k - €${(currentFilters.maxPrice / 1000).toFixed(0)}k`;
  };

  const getBedroomsDisplayText = () => {
    return currentFilters.bedrooms === 'any' ? 'Bedrooms' : `${currentFilters.bedrooms}+ Bedrooms`;
  };

  const getBathroomsDisplayText = () => {
    return currentFilters.bathrooms === 'any' ? 'Bathrooms' : `${currentFilters.bathrooms}+ Bathrooms`;
  };

  return (
    <div className="space-y-2">
      {/* Search Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Location Filter */}
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
            <DropdownMenuContent className="w-56 bg-white border-navy-800 z-50 max-h-60 overflow-y-auto">
              <ScrollArea className="h-72">
                {availableLocations.map((location) => (
                  <DropdownMenuCheckboxItem
                    key={location}
                    checked={selectedLocations.includes(location)}
                    onSelect={(e) => {
                      e.preventDefault();
                      handleLocationToggle(location);
                    }}
                    className="text-navy-800"
                  >
                    {location}
                  </DropdownMenuCheckboxItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bedrooms Filter */}
          <Select 
            value={currentFilters.bedrooms} 
            onValueChange={(value) => onFilterChange({...currentFilters, bedrooms: value})}
          >
            <SelectTrigger className="h-12 border-2 border-navy-800 bg-white text-navy-800 hover:bg-gray-50">
              <div className="flex items-center space-x-2 w-full">
                <BedDouble className="h-5 w-5 text-navy-800" />
                <span className="text-sm font-medium text-navy-800">
                  {getBedroomsDisplayText()}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-navy-800 z-50">
              <SelectItem value="any" className="text-navy-800">All</SelectItem>
              <SelectItem value="1" className="text-navy-800">1+</SelectItem>
              <SelectItem value="2" className="text-navy-800">2+</SelectItem>
              <SelectItem value="3" className="text-navy-800">3+</SelectItem>
              <SelectItem value="4" className="text-navy-800">4+</SelectItem>
              <SelectItem value="5" className="text-navy-800">5+</SelectItem>
            </SelectContent>
          </Select>

          {/* Bathrooms Filter */}
          <Select 
            value={currentFilters.bathrooms} 
            onValueChange={(value) => onFilterChange({...currentFilters, bathrooms: value})}
          >
            <SelectTrigger className="h-12 border-2 border-navy-800 bg-white text-navy-800 hover:bg-gray-50">
              <div className="flex items-center space-x-2 w-full">
                <Bath className="h-5 w-5 text-navy-800" />
                <span className="text-sm font-medium text-navy-800">
                  {getBathroomsDisplayText()}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-navy-800 z-50">
              <SelectItem value="any" className="text-navy-800">All</SelectItem>
              <SelectItem value="1" className="text-navy-800">1+</SelectItem>
              <SelectItem value="2" className="text-navy-800">2+</SelectItem>
              <SelectItem value="3" className="text-navy-800">3+</SelectItem>
              <SelectItem value="4" className="text-navy-800">4+</SelectItem>
              <SelectItem value="5" className="text-navy-800">5+</SelectItem>
            </SelectContent>
          </Select>

          {/* Price Filter */}
          <Select 
            value={
              currentFilters.minPrice === 0 && currentFilters.maxPrice === 5000000 
                ? "any" 
                : currentFilters.minPrice === 0 
                  ? `0-${currentFilters.maxPrice}` 
                  : currentFilters.maxPrice === 5000000 
                    ? `${currentFilters.minPrice}+` 
                    : `${currentFilters.minPrice}-${currentFilters.maxPrice}`
            } 
            onValueChange={(value) => {
              if (value === "any") {
                onFilterChange({...currentFilters, minPrice: 0, maxPrice: 5000000});
              } else if (value.includes("-")) {
                const [min, max] = value.split("-").map(Number);
                onFilterChange({...currentFilters, minPrice: min, maxPrice: max});
              } else if (value.endsWith("+")) {
                const min = parseInt(value.replace("+", ""));
                onFilterChange({...currentFilters, minPrice: min, maxPrice: 5000000});
              }
            }}
          >
            <SelectTrigger className="h-12 border-2 border-navy-800 bg-white text-navy-800 hover:bg-gray-50">
              <div className="flex items-center space-x-2 w-full">
                <Euro className="h-5 w-5 text-navy-800" />
                <span className="text-sm font-medium text-navy-800">
                  {getPriceDisplayText()}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-navy-800 z-50">
              <SelectItem value="any" className="text-navy-800">All prices</SelectItem>
              <SelectItem value="0-500000" className="text-navy-800">Up to €500,000</SelectItem>
              <SelectItem value="500000-1000000" className="text-navy-800">€500,000 - €1,000,000</SelectItem>
              <SelectItem value="1000000+" className="text-navy-800">€1,000,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active Filter Badges - Displayed below search filters */}
      <ActiveFilters currentFilters={currentFilters} onFilterChange={onFilterChange} />
    </div>
  );
};

export default PropertyFilters;
