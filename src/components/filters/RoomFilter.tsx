
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoomFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const RoomFilter = ({ label, value, onChange }: RoomFilterProps) => {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-white">{label}</label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger className="text-white border-navy-600 bg-navy-700">
          <SelectValue placeholder="Any" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any</SelectItem>
          <SelectItem value="1">1+</SelectItem>
          <SelectItem value="2">2+</SelectItem>
          <SelectItem value="3">3+</SelectItem>
          <SelectItem value="4">4+</SelectItem>
          {label === "Bedrooms" && <SelectItem value="5">5+</SelectItem>}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoomFilter;
