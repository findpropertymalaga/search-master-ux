import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/components/property/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { mapSupabaseProperty } from './featured-properties/propertyMapper';
import FeaturedPropertiesLoading from './featured-properties/FeaturedPropertiesLoading';
import FeaturedPropertiesHeader from './featured-properties/FeaturedPropertiesHeader';
import MobilePropertiesView from './featured-properties/MobilePropertiesView';
import DesktopPropertiesView from './featured-properties/DesktopPropertiesView';

const FeaturedPropertiesSlideshow = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [mobileDisplayCount, setMobileDisplayCount] = useState(6);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const PROPERTIES_PER_PAGE = 6;
  const TOTAL_PROPERTIES = 36;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        // Fetch from resales_feed table
        const { data: feedData, error: feedError } = await (supabase as any)
          .from('resales_feed')
          .select('*')
          .not('images', 'is', null)
          .gte('price', 500000)
          .or('type.ilike.%apartment%,type.ilike.%house%,type.ilike.%villa%,type.ilike.%penthouse%')
          .order('status_date', { ascending: false })
          .limit(TOTAL_PROPERTIES);
        
        if (feedError) {
          throw feedError;
        }
        
        // Fetch from resales_new_devs table
        const { data: newDevsData, error: newDevsError } = await (supabase as any)
          .from('resales_new_devs')
          .select('*')
          .not('images', 'is', null)
          .gte('price', 500000)
          .or('type.ilike.%apartment%,type.ilike.%house%,type.ilike.%villa%,type.ilike.%penthouse%')
          .order('status_date', { ascending: false })
          .limit(TOTAL_PROPERTIES);
        
        if (newDevsError) {
          throw newDevsError;
        }
        
        // Combine and sort by status_date
        const combinedData = [...(feedData || []), ...(newDevsData || [])]
          .sort((a, b) => {
            const dateA = new Date(a.status_date || 0).getTime();
            const dateB = new Date(b.status_date || 0).getTime();
            return dateB - dateA; // Newest first
          })
          .slice(0, TOTAL_PROPERTIES); // Limit to 36 total properties
        
        const mappedProperties = combinedData.map(mapSupabaseProperty);
        setProperties(mappedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load properties. Please refresh the page.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [toast]);

  const totalPages = Math.ceil(properties.length / PROPERTIES_PER_PAGE);
  const currentProperties = properties.slice(
    currentPage * PROPERTIES_PER_PAGE,
    (currentPage + 1) * PROPERTIES_PER_PAGE
  );

  const hasMoreMobile = mobileDisplayCount < properties.length;

  const goToNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const loadMoreMobile = () => {
    setMobileDisplayCount(prev => Math.min(prev + 6, properties.length));
  };

  if (loading) {
    return <FeaturedPropertiesLoading />;
  }

  return (
    <div className="container-custom py-16">
      <FeaturedPropertiesHeader />
      
      {/* Mobile version - Simple grid with load more */}
      {isMobile ? (
        <MobilePropertiesView 
          properties={properties}
          mobileDisplayCount={mobileDisplayCount}
          hasMoreMobile={hasMoreMobile}
          onLoadMore={loadMoreMobile}
        />
      ) : (
        /* Desktop version - Carousel with navigation */
        <DesktopPropertiesView 
          currentProperties={currentProperties}
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={goToNext}
          onPrevious={goToPrevious}
          onPageSelect={setCurrentPage}
        />
      )}
      
      {properties.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          Inga utvalda fastigheter hittades.
        </div>
      )}
    </div>
  );
};

export default FeaturedPropertiesSlideshow;
