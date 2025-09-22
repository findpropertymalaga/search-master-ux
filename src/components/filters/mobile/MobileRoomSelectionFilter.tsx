
import React from 'react';

interface RoomOption {
  value: string;
  label: string;
}

interface MobileRoomSelectionFilterProps {
  title: string;
  options: RoomOption[];
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
}

const MobileRoomSelectionFilter = ({
  title,
  options,
  selectedValues,
  onValueChange
}: MobileRoomSelectionFilterProps) => {
  
  const handleOptionClick = (optionValue: string) => {
    if (optionValue === 'any') {
      // If "All" is clicked, clear other selections
      onValueChange(['any']);
    } else {
      // If any other option is clicked
      let newValues = [...selectedValues];
      
      // Remove "any" if it was previously selected
      newValues = newValues.filter(val => val !== 'any');
      
      if (selectedValues.includes(optionValue)) {
        // Remove the option if already selected
        newValues = newValues.filter(val => val !== optionValue);
        
        // If no options left, default to "any"
        if (newValues.length === 0) {
          newValues = ['any'];
        }
      } else {
        // Add the option
        newValues.push(optionValue);
      }
      
      onValueChange(newValues);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-3">{title}</h3>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
              selectedValues.includes(option.value)
                ? 'border-costa-600 bg-costa-600 text-white'
                : 'border-navy-600 bg-navy-800 text-white hover:bg-navy-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileRoomSelectionFilter;
