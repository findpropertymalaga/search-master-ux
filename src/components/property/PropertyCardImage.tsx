
import { Badge } from '@/components/ui/badge';
import { Property } from './types';

interface PropertyCardImageProps {
  property: Property;
  isSwipingDetected: boolean;
  setIsSwipingDetected: (value: boolean) => void;
  navigateToProperty: (e: React.MouseEvent) => void;
}

export const PropertyCardImage = ({ 
  property, 
  isSwipingDetected, 
  setIsSwipingDetected,
  navigateToProperty 
}: PropertyCardImageProps) => {
  // Don't render if property data is incomplete (loading state)
  if (!property.title || !property.id || property.title === 'Loading...' || property.id === 'loading') {
    return (
      <div className="aspect-[4/3] w-full bg-muted animate-pulse rounded-lg" />
    );
  }

  // Use the primary images array from the property
  const images = property.images && property.images.length > 0
    ? property.images 
    : ['/placeholder.svg']; // Fallback to placeholder if no images


  // Get update status text based on status_date
  const getUpdateStatus = (statusDate: string | undefined) => {
    if (!statusDate) return null; // Don't show badge for properties without status_date
    
    try {
      const date = new Date(statusDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Updated today';
      if (diffDays === 1) return 'Updated 1 day ago';
      if (diffDays < 7) return `Updated ${diffDays} days ago`;
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? 'Updated 1 week ago' : `Updated ${weeks} weeks ago`;
      }
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return months === 1 ? 'Updated 1 month ago' : `Updated ${months} months ago`;
      }
      
      const years = Math.floor(diffDays / 365);
      return years === 1 ? 'Updated 1 year ago' : `Updated ${years} years ago`;
    } catch (error) {
      return null; // Don't show badge if date parsing fails
    }
  };

  return (
    <div className="relative">
      {/* Single image for property card - only first image, no slideshow */}
      <div 
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl cursor-pointer"
        onClick={() => !isSwipingDetected && navigateToProperty({} as React.MouseEvent)}
      >
        <img
          src={images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      
      {/* Update status badge overlay - shows for all properties with status_date */}
      {getUpdateStatus(property.status_date) && (
        <Badge 
          className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-600 z-10 text-white"
        >
          {getUpdateStatus(property.status_date)}
        </Badge>
      )}
    </div>
  );
};
