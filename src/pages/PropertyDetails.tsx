
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EnhancedGallery from '@/components/property/EnhancedGallery';
import PropertyHeader from '@/components/property/PropertyHeader';
import PropertyDescription from '@/components/property/PropertyDescription';
import PropertyFeatures from '@/components/property/PropertyFeatures';
import PropertyRequestForm from '@/components/PropertyRequestForm';
import { PropertyNotFound, PropertyDetailLayout } from '@/components/property/PropertyLoadingStates';
import { mapSupabaseProperty, DetailedProperty } from '@/utils/propertyMappers';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import ScrollToTop from '@/components/ui/scroll-to-top';
import { Separator } from '@/components/ui/separator';
import { useDynamicOGTags } from '@/hooks/useDynamicOGTags';
import { useEnhancedPropertyNavigation } from '@/hooks/useEnhancedPropertyNavigation';

const PropertyDetailsSkeleton = () => (
  <PropertyDetailLayout>
    {/* Gallery Skeleton */}
    <div className="mb-8">
      <Skeleton className="aspect-[16/9] w-full rounded-lg" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Property Details Skeleton */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-5 w-1/2 mb-4" />
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-32 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            
            <div>
              <Skeleton className="h-6 w-24 mb-3" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16 rounded" />
                <Skeleton className="h-16 rounded" />
                <Skeleton className="h-16 rounded" />
                <Skeleton className="h-16 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Form Skeleton */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-white rounded-lg shadow-sm p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  </PropertyDetailLayout>
);

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<DetailedProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRental, setIsRental] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Enhanced property navigation that works with full search results
  const { previousPropertyId, nextPropertyId, loading: navLoading } = useEnhancedPropertyNavigation(
    id || '',
    isRental
  );

  console.log('=== PROPERTY DETAILS DEBUG ===');
  console.log('Property ID:', id);
  console.log('Is rental:', isRental);  
  console.log('Previous ID:', previousPropertyId);
  console.log('Next ID:', nextPropertyId);
  console.log('Nav loading:', navLoading);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Try to fetch from resales_feed first
        let { data, error } = await (supabase as any)
          .from('resales_feed')
          .select('*')
          .eq('property_id', id)
          .single();

        // If not found in resales_feed, try resales_new_devs
        if (error || !data) {
          console.log('Property not found in resales_feed, trying resales_new_devs...');
          const newDevsResponse = await supabase
            .from('resales_new_devs')
            .select('*')
            .eq('property_id', id)
            .single();
          
          if (!newDevsResponse.error && newDevsResponse.data) {
            console.log('Found property in resales_new_devs:', newDevsResponse.data);
            data = newDevsResponse.data;
            error = null;
          } else {
            console.log('Property not found in resales_new_devs, trying resales_rentals...');
            const rentalResponse = await supabase
              .from('resales_rentals')
              .select('*')
              .eq('property_id', id)
              .single();
            
            if (rentalResponse.error) {
              console.error('Error fetching rental property:', rentalResponse.error);
              setError('Property not found');
              return;
            }
            
            const rentalData = rentalResponse.data;
          
          // For rental properties, use a simpler transformation since they have different structure
          if (rentalData) {
            // Handle surface_area properly
            const surfaceArea = rentalData.surface_area as any;
            const builtArea = surfaceArea?.built ? Number(surfaceArea.built) : 0;
            const plotArea = surfaceArea?.plot ? Number(surfaceArea.plot) : undefined;
            
            // Handle images array properly
            const images = Array.isArray(rentalData.images) ? (rentalData.images as string[]) : [];
            
            // Handle features array properly  
            const features = Array.isArray(rentalData.features) ? (rentalData.features as string[]) : [];
            
            const rentalProperty: DetailedProperty = {
              id: rentalData.property_id || '',
              title: `${rentalData.type || 'Property'} in ${rentalData.town || 'Location'}`,
              price: rentalData.price || 0,
              location: rentalData.town || '',
              area: rentalData.area || '',
              bedrooms: rentalData.beds || 0,
              bathrooms: rentalData.baths || 0,
              size: builtArea,
              plotSize: plotArea,
              images: images,
              description: rentalData.description || '',
              features: features,
              propertyType: rentalData.type || '',
              coordinates: (rentalData as any).latitude && (rentalData as any).longitude ? {
                lat: parseFloat(String((rentalData as any).latitude)),
                lng: parseFloat(String((rentalData as any).longitude))
              } : undefined,
              parking: Boolean(rentalData.has_garage),
              garden: Boolean(rentalData.has_garden),  
              pool: Boolean(rentalData.has_pool),
              status: 'available',
              listedDate: rentalData.listed_date,
              currency: rentalData.currency || 'EUR',
              province: rentalData.province || '',
              town: rentalData.town || '',
              urbanisation: '',
              developmentName: '',
              // Rental-specific pricing
              shortterm_low: ((rentalData as any).shortterm_low !== null && (rentalData as any).shortterm_low !== undefined && (rentalData as any).shortterm_low > 0) ? (rentalData as any).shortterm_low : undefined,
              longterm: ((rentalData as any).longterm !== null && (rentalData as any).longterm !== undefined && (rentalData as any).longterm > 0) ? (rentalData as any).longterm : undefined,
              // Legacy fields for backward compatibility
              type: rentalData.type,
              latitude: (rentalData as any).latitude ? parseFloat(String((rentalData as any).latitude)) : undefined,
              longitude: (rentalData as any).longitude ? parseFloat(String((rentalData as any).longitude)) : undefined,
              propertyRef: rentalData.property_id,
              listed_date: rentalData.listed_date,
              status_date: rentalData.status_date
            };
            setProperty(rentalProperty);
            setIsRental(true);
            setLoading(false);
            return;
            }
          }
        }

        if (!data) {
          setError('Property not found');
          return;
        }

        if (data) {
          // Map the property using the same mapper
          const mappedProperty = mapSupabaseProperty(data);
          setProperty(mappedProperty);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Update Open Graph tags for social media sharing
  useDynamicOGTags({
    title: property ? `${property.title} - FindProperty.es` : undefined,
    description: property ? property.description.substring(0, 160) : undefined,
    image: property?.images?.[0] ? property.images[0] : undefined,
    url: property ? `/properties/${property.id}` : undefined
  });

  // Show loading skeleton
  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  // Show error/not found state
  if (error || !property) {
    return <PropertyNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Navigation buttons */}
        <div className="flex justify-between items-center mb-6">
          {/* Back button */}
          <button
            onClick={() => navigate(isRental ? '/rent' : '/properties')}
            className="flex items-center text-costa-600 hover:text-costa-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </button>

          {/* Previous/Next navigation */}
          <div className="flex items-center gap-2">
            {previousPropertyId ? (
              <Link
                to={`/properties/${previousPropertyId}`}
                className="flex items-center px-3 py-2 text-sm text-costa-600 hover:text-costa-700 hover:bg-costa-50 rounded-md transition-colors"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Link>
            ) : (
              <span className="flex items-center px-3 py-2 text-sm text-gray-400 cursor-not-allowed">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </span>
            )}
            
            {nextPropertyId ? (
              <Link
                to={`/properties/${nextPropertyId}`}
                className="flex items-center px-3 py-2 text-sm text-costa-600 hover:text-costa-700 hover:bg-costa-50 rounded-md transition-colors"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            ) : (
              <span className="flex items-center px-3 py-2 text-sm text-gray-400 cursor-not-allowed">
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </span>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <EnhancedGallery 
            images={property.images} 
            title={property.title}
            variant="detailed"
            showFullscreenButton={true}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <PropertyHeader property={property} isRental={isRental} />
                <PropertyDescription description={property.description} />
                
                {/* Strikethrough separator */}
                <div className="my-8 relative">
                  <Separator className="bg-gray-300" />
                </div>
                
                <PropertyFeatures features={property.features} />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 sticky top-4">
                <h3 className="text-xl font-semibold mb-4">Request Information</h3>
                <PropertyRequestForm 
                  propertyId={property.id}
                  propertyTitle={property.title}
                  propertyRef={property.propertyRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
};

export default PropertyDetails;
