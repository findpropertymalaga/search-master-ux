
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Property } from '@/components/property/types';
import PropertyCard from '@/components/PropertyCard';

interface DesktopPropertiesViewProps {
  currentProperties: Property[];
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
  onPageSelect: (page: number) => void;
}

const DesktopPropertiesView = ({ 
  currentProperties, 
  currentPage, 
  totalPages, 
  onNext, 
  onPrevious, 
  onPageSelect 
}: DesktopPropertiesViewProps) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <>
          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white shadow-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white shadow-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Page indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => onPageSelect(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentPage ? 'bg-costa-600 w-4' : 'bg-gray-300'
                }`}
                aria-label={`Gå till sida ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DesktopPropertiesView;
