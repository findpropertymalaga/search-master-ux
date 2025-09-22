
interface HorizontalSelectionFilterProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const HorizontalSelectionFilter = ({ label, value, options, onChange }: HorizontalSelectionFilterProps) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-3 block">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-md border-2 text-sm font-medium transition-colors ${
              value === option.value
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

export default HorizontalSelectionFilter;
