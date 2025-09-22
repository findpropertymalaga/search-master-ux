
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/components/property/types';
import { Button } from '@/components/ui/button';
import PropertyPagination from '@/components/PropertyPagination';
import { useMemo } from 'react';
import { useEffect } from 'react';

interface PropertyGridProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  error?: string | null;
  loading?: boolean;
}

const PropertyGrid = ({ properties, currentPage, totalPages, onPageChange, error, loading = false }: PropertyGridProps) => {
  // Store current properties in sessionStorage for navigation
  useEffect(() => {
    if (properties && properties.length > 0) {
      sessionStorage.setItem('currentProperties', JSON.stringify(properties));
      console.log(`Stored ${properties.length} properties for navigation`);
    }
  }, [properties]);
  // Memoize the property cards to prevent unnecessary re-renders
  const propertyCards = useMemo(() => {
    return properties.map((property) => (
      <PropertyCard key={property.id} property={property} />
    ));
  }, [properties]);

  // Show error message if there is an error
  if (error) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-2 text-red-600">Error</h3>
        <p className="text-gray-500 mb-4">
          {error}
        </p>
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
          className="hover:bg-costa-50"
        >
          Try again
        </Button>
      </div>
    );
  }

  // Show "no properties found" message if there are no properties and not loading
  if (properties.length === 0 && !loading) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-2">No properties found</h3>
        <p className="text-gray-500 mb-4">
          Try adjusting your search filters to find more properties
        </p>
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/properties'}
          className="hover:bg-costa-50"
        >
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {propertyCards}
      </div>
      
      <PropertyPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        loading={loading}
      />
    </>
  );
};

export default PropertyGrid;
