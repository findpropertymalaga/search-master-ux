
import { BedDouble, Bath } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { bedroomOptions, bathroomOptions } from '@/components/filters/RoomOptions';
import { getRoomDisplayText } from '@/utils/roomFilterHelpers';

interface HeroRoomFiltersProps {
  bedrooms: string;
  bathrooms: string;
  onBedroomsChange: (value: string) => void;
  onBathroomsChange: (value: string) => void;
}

const HeroRoomFilters = ({ bedrooms, bathrooms, onBedroomsChange, onBathroomsChange }: HeroRoomFiltersProps) => {
  const getBedroomsDisplayText = () => {
    return getRoomDisplayText(bedrooms, bedroomOptions);
  };

  const getBathroomsDisplayText = () => {
    return getRoomDisplayText(bathrooms, bathroomOptions);
  };

  return (
    <>
      {/* Bedrooms Filter */}
      <Select value={bedrooms} onValueChange={onBedroomsChange}>
        <SelectTrigger className="h-12 border-2 border-navy-800 bg-white text-navy-800 hover:bg-gray-50">
          <div className="flex items-center space-x-2 w-full">
            <BedDouble className="h-5 w-5 text-navy-800" />
            <span className="text-sm font-medium text-navy-800">
              {getBedroomsDisplayText()}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border-navy-800 z-50">
          {bedroomOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-navy-800">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Bathrooms Filter */}
      <Select value={bathrooms} onValueChange={onBathroomsChange}>
        <SelectTrigger className="h-12 border-2 border-navy-800 bg-white text-navy-800 hover:bg-gray-50">
          <div className="flex items-center space-x-2 w-full">
            <Bath className="h-5 w-5 text-navy-800" />
            <span className="text-sm font-medium text-navy-800">
              {getBathroomsDisplayText()}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border-navy-800 z-50">
          {bathroomOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-navy-800">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default HeroRoomFilters;
