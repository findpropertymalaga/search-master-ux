

import { cn } from '@/lib/utils';
import { PropertyCardImage } from '@/components/property/PropertyCardImage';
import { PropertyCardDetails } from '@/components/property/PropertyCardDetails';
import { Property } from '@/components/property/types';

// Re-export the Property interface
export type { Property };

interface PropertyCardProps {
  property: Property;
  className?: string;
}

const PropertyCard = ({ property, className }: PropertyCardProps) => {
  const navigateToProperty = (e: React.MouseEvent) => {
    // Get current page info from URL or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page') || '1', 10);
    
    // Save current properties list to navigation memory before navigating
    const currentProperties = JSON.parse(sessionStorage.getItem('currentProperties') || '[]');
    
    // Save to both scroll memory and navigation memory
    const scrollEvent = new CustomEvent('saveScrollState');
    window.dispatchEvent(scrollEvent);
    
    // Save navigation data with current page number
    const navigationData = {
      properties: currentProperties,
      currentPage: currentPage,
      scrollY: window.scrollY,
      timestamp: Date.now()
    };
    
    // Determine if we're on rent or buy page from current URL
    const currentPath = window.location.pathname;
    const isRentPage = currentPath.includes('/rent');
    const storageKey = isRentPage ? 'scrollMemory_rent' : 'scrollMemory_buy';
    
    sessionStorage.setItem(storageKey, JSON.stringify(navigationData));
    console.log(`Saved navigation state to ${storageKey}: page ${currentPage}, ${currentProperties.length} properties`);
    
    window.location.href = `/properties/${property.id}`;
  };

  return (
    <div className={cn(
      "group bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1",
      className
    )}>
      <PropertyCardImage 
        property={property}
        isSwipingDetected={false}
        setIsSwipingDetected={() => {}}
        navigateToProperty={navigateToProperty}
      />
      
      <PropertyCardDetails 
        property={property}
        isSwipingDetected={false}
        isTouching={false}
      />
    </div>
  );
};

export default PropertyCard;
