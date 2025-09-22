import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MobileTypeFilterProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  isRentalPage?: boolean;
}

interface Option {
  value: string;
  label: string;
}

const MobileTypeFilter = ({ value, onChange, isRentalPage = false }: MobileTypeFilterProps) => {
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      if (isRentalPage) return; // rentals use predefined options
      try {
        const [resales, newDevs] = await Promise.all([
          (supabase as any)
            .from('resales_feed')
            .select('type')
            .not('type', 'is', null)
            .not('type', 'eq', ''),
          (supabase as any)
            .from('resales_new_devs')
            .select('type')
            .not('type', 'is', null)
            .not('type', 'eq', '')
        ]);
        if (resales.error) {
          console.error('MobileTypeFilter: resales_feed types error', resales.error);
          return;
        }
        if (newDevs.error) {
          console.error('MobileTypeFilter: resales_new_devs types error', newDevs.error);
          return;
        }
        const all = [
          ...(resales.data || []).map((r: any) => r.type),
          ...(newDevs.data || []).map((r: any) => r.type),
        ].filter(Boolean);
        setAvailableTypes([...new Set(all)] as string[]);
      } catch (e) {
        console.error('MobileTypeFilter: fetch types failed', e);
      }
    };
    fetchTypes();
  }, [isRentalPage]);

  const getTypeOptions = (): Option[] => {
    if (isRentalPage) {
      return [
        { value: 'any', label: 'All' },
        { value: 'apartment', label: 'Apartment' },
        { value: 'house', label: 'House' },
        { value: 'duplex', label: 'Duplex' },
        { value: 'penthouse', label: 'Penthouse' },
        { value: 'ground-floor', label: 'Ground Floor' },
        { value: 'commercial', label: 'Commercial' }
      ];
    }

    const has = (prefix: string) => availableTypes.some((t) => t?.startsWith(prefix));

    const options: Option[] = [{ value: 'any', label: 'All' }];
    if (has('Apartment -')) options.push({ value: 'apartment', label: 'Apartment' });
    if (has('House -')) options.push({ value: 'house', label: 'House' });
    if (has('Plot -')) options.push({ value: 'plot', label: 'Plot' });
    if (has('Commercial -')) options.push({ value: 'commercial', label: 'Commercial' });
    // Keep consistent with desktop
    options.push({ value: 'new-devs', label: 'New Devs' });
    return options;
  };

  const typeOptions = getTypeOptions();

  const isSelected = (optionValue: string) => {
    if (Array.isArray(value)) return value.includes(optionValue);
    if (typeof value === 'string') {
      if (value === 'any') return optionValue === 'any';
      const arr = value.split(',').filter(Boolean);
      return arr.includes(optionValue);
    }
    return value === optionValue;
  };

  const handleClick = (optionValue: string) => {
    if (optionValue === 'any') {
      onChange('any');
      return;
    }
    let current: string[] = [];
    if (Array.isArray(value)) current = value.filter((v) => v !== 'any');
    else if (typeof value === 'string' && value !== 'any') current = value.split(',').filter(Boolean);

    if (current.includes(optionValue)) {
      const next = current.filter((v) => v !== optionValue);
      onChange(next.length === 0 ? 'any' : next);
    } else {
      const next = [...new Set([...current, optionValue])];
      onChange(next);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-3">Type</h3>
      <div className="flex gap-2 flex-wrap">
        {typeOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleClick(opt.value)}
            className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
              isSelected(opt.value)
                ? 'border-costa-600 bg-costa-600 text-white'
                : 'border-navy-600 bg-navy-800 text-white hover:bg-navy-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileTypeFilter;
