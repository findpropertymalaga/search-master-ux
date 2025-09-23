
import { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface HeroTypeFilterProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  isRentalPage?: boolean;
}

const HeroTypeFilter = ({ value, onChange, isRentalPage = false }: HeroTypeFilterProps) => {
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      if (isRentalPage) {
        // For rental page, we don't fetch from database, we use predefined types
        setAvailableTypes([]);
        return;
      }

      try {
        const { data, error } = await (supabase as any)
          .from('resales_feed')
          .select('type')
          .not('type', 'is', null)
          .not('type', 'eq', '');
          
        if (error) {
          console.error('Error fetching types:', error);
          return;
        }
        
        // Get unique types and sort them
        const types = [...new Set(data.map((item: any) => item.type))]
          .filter(Boolean)
          .sort() as string[];
          
        console.log('Available types from database:', types);
        setAvailableTypes(types);
      } catch (error) {
        console.error('Failed to fetch types:', error);
      }
    };
    
    fetchTypes();
  }, [isRentalPage]);

  // Get type options based on page type
  const getTypeOptions = () => {
    if (isRentalPage) {
      return [
        { value: 'any', label: 'Alla typer' },
        { value: 'apartment', label: 'Lägenhet' },
        { value: 'house', label: 'Hus' },
        { value: 'duplex', label: 'Duplex' },
        { value: 'penthouse', label: 'Takvåning' },
        { value: 'ground-floor', label: 'Bottenvåning' },
        { value: 'commercial', label: 'Kommersiell' }
      ];
    }

    // For buy page, group types into main categories based on actual database values
    const groupedTypes = [];
    
    // Check if we have any apartment types
    const hasApartments = availableTypes.some(type => 
      type.startsWith('Apartment -')
    );
    
    // Check if we have any house types
    const hasHouses = availableTypes.some(type => 
      type.startsWith('House -')
    );
    
    // Check if we have any plot types (only for buy page)
    const hasPlots = availableTypes.some(type => 
      type.startsWith('Plot -')
    );
    
    // Check if we have any commercial types (only for buy page)
    const hasCommercial = availableTypes.some(type => 
      type.startsWith('Commercial -')
    );
    
    if (hasApartments) groupedTypes.push({ value: 'apartment', label: 'Lägenhet' });
    if (hasHouses) groupedTypes.push({ value: 'house', label: 'Hus' });
    if (hasPlots) groupedTypes.push({ value: 'plot', label: 'Tomt' });
    if (hasCommercial) groupedTypes.push({ value: 'commercial', label: 'Kommersiell' });
    
    return [
      { value: 'any', label: 'Alla typer' },
      ...groupedTypes
    ];
  };

  const typeOptions = getTypeOptions();

  const getTypeDisplayText = () => {
    if (!value || value === 'any') return "Alla typer";
    if (Array.isArray(value)) {
      if (value.length === 0) return "Alla typer";
      if (value.length === 1) {
        const option = typeOptions.find(opt => opt.value === value[0]);
        return option ? option.label : value[0];
      }
      return `${value.length} typer valda`;
    }
    const option = typeOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const handleValueChange = (newValue: string) => {
    if (newValue === 'any') {
      onChange('any');
      return;
    }

    // Normalize current value to array, handling comma-separated strings
    let currentValues: string[] = [];
    if (Array.isArray(value)) {
      currentValues = value.filter(v => v !== 'any');
    } else if (typeof value === 'string' && value !== 'any') {
      currentValues = value.split(',').filter(Boolean).filter(v => v !== 'any');
      // Remove duplicates
      currentValues = [...new Set(currentValues)];
    }

    if (currentValues.includes(newValue)) {
      // Remove the option
      const newValues = currentValues.filter(v => v !== newValue);
      onChange(newValues.length === 0 ? 'any' : newValues);
    } else {
      // Add the option, ensuring no duplicates
      const newValues = [...new Set([...currentValues, newValue])];
      onChange(newValues);
    }
  };

  return (
    <Select value={Array.isArray(value) ? value[0] || 'any' : value} onValueChange={handleValueChange}>
      <SelectTrigger className="h-12 border-2 border-navy-800 bg-white text-navy-800 hover:bg-gray-50">
        <div className="flex items-center space-x-2 w-full">
          <Home className="h-5 w-5 text-navy-800" />
          <span className="text-sm font-medium text-navy-800">
            {getTypeDisplayText()}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border-navy-800 z-50 max-h-60 overflow-y-auto">
        {typeOptions.map((type) => (
          <SelectItem key={type.value} value={type.value} className="text-navy-800">
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default HeroTypeFilter;
