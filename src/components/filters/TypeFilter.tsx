
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TypeFilterProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  isRentalPage?: boolean;
}

const TypeFilter = ({ value, onChange, isRentalPage = false }: TypeFilterProps) => {
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      if (isRentalPage) {
        // For rental page, we don't fetch from database, we use predefined types
        setAvailableTypes([]);
        return;
      }

      try {
        // Fetch types from both tables for buy page
        const [newResalesResult, newDevsResult] = await Promise.all([
          (supabase as any)
            .from('resales_feed')
            .select('type')
            .not('type', 'is', null)
            .not('type', 'eq', ''),
          supabase
            .from('resales_new_devs')
            .select('type')
            .not('type', 'is', null)
            .not('type', 'eq', '')
        ]);
          
        if (newResalesResult.error) {
          console.error('Error fetching types from resales_feed:', newResalesResult.error);
          return;
        }

        if (newDevsResult.error) {
          console.error('Error fetching types from resales_new_devs:', newDevsResult.error);
          return;
        }
        
        // Combine and get unique types from both tables
        const allTypes = [
          ...(newResalesResult.data || []).map(item => item.type),
          ...(newDevsResult.data || []).map(item => item.type)
        ];
        
        const types = [...new Set(allTypes)]
          .filter(Boolean)
          .sort();
          
        console.log('Available types from both tables:', types);
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
        { value: 'any', label: 'All' },
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
    
    // Add New Devs option for buy page
    groupedTypes.push({ value: 'new-devs', label: 'Nybygge' });
    
    return [
      { value: 'any', label: 'Alla' },
      ...groupedTypes
    ];
  };

  const typeOptions = getTypeOptions();

  // Helper functions for multiple selection
  const isSelected = (optionValue: string) => {
    // Handle both array and comma-separated string values
    if (Array.isArray(value)) {
      return value.includes(optionValue);
    }
    if (typeof value === 'string') {
      if (value === 'any') return optionValue === 'any';
      const valueArray = value.split(',').filter(Boolean);
      return valueArray.includes(optionValue);
    }
    return value === optionValue;
  };

  const handleOptionClick = (optionValue: string) => {
    if (optionValue === 'any') {
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

    if (currentValues.includes(optionValue)) {
      // Remove the option
      const newValues = currentValues.filter(v => v !== optionValue);
      onChange(newValues.length === 0 ? 'any' : newValues);
    } else {
      // Add the option, ensuring no duplicates
      const newValues = [...new Set([...currentValues, optionValue])];
      onChange(newValues);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-3 block">Typ</label>
      <div className="flex gap-2 flex-wrap">
        {typeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className={`px-4 py-2 rounded-md border-2 text-sm font-medium transition-colors ${
              isSelected(option.value)
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-blue-500 bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
