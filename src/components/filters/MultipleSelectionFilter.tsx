interface MultipleSelectionFilterProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const MultipleSelectionFilter = ({ label, value, options, onChange }: MultipleSelectionFilterProps) => {
  // Helper functions for multiple selection
  const isSelected = (optionValue: string) => {
    if (value === 'any') return optionValue === 'any';
    const valueArray = value.split(',').filter(Boolean);
    return valueArray.includes(optionValue);
  };

  const handleOptionClick = (optionValue: string) => {
    if (optionValue === 'any') {
      onChange('any');
      return;
    }

    // Handle current value as comma-separated string
    let currentValues: string[] = [];
    if (value && value !== 'any') {
      currentValues = value.split(',').filter(Boolean);
    }

    if (currentValues.includes(optionValue)) {
      // Remove the option
      const newValues = currentValues.filter(v => v !== optionValue);
      onChange(newValues.length === 0 ? 'any' : newValues.join(','));
    } else {
      // Add the option
      const newValues = [...currentValues, optionValue];
      onChange(newValues.join(','));
    }
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-3 block">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
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

export default MultipleSelectionFilter;