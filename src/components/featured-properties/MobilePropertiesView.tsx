
import { Button } from "@/components/ui/button";
import { Property } from '@/components/property/types';
import PropertyCard from '@/components/PropertyCard';

interface MobilePropertiesViewProps {
  properties: Property[];
  mobileDisplayCount: number;
  hasMoreMobile: boolean;
  onLoadMore: () => void;
}

const MobilePropertiesView = ({ 
  properties, 
  mobileDisplayCount, 
  hasMoreMobile, 
  onLoadMore 
}: MobilePropertiesViewProps) => {
  const mobileProperties = properties.slice(0, mobileDisplayCount);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {mobileProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      
      {hasMoreMobile && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            className="px-8 py-2 text-navy-700 border-navy-200 hover:bg-navy-50"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobilePropertiesView;
