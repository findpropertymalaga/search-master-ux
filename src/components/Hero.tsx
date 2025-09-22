
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroBackground from './hero/HeroBackground';
import HeroContent from './hero/HeroContent';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const navigate = useNavigate();
  const [buyPropertyCount, setBuyPropertyCount] = useState<number | null>(null);
  const [rentPropertyCount, setRentPropertyCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch total count of properties when component mounts from both tables
    const fetchPropertyCounts = async () => {
      try {
        // Fetch buy properties count from resales_feed table with minimum €150,000 filter
        const { count: resalesCount, error: buyError } = await (supabase as any)
          .from('resales_feed')
          .select('*', { count: 'exact', head: true })
          .gte('price', 150000);
        
        // Fetch buy properties count from resales_new_devs table with minimum €150,000 filter
        const { count: newDevsCount, error: newDevsError } = await supabase
          .from('resales_new_devs')
          .select('*', { count: 'exact', head: true })
          .gte('price', 150000);
        
        if (buyError) {
          console.error('Error fetching resales_feed count:', buyError);
        }
        
        if (newDevsError) {
          console.error('Error fetching resales_new_devs count:', newDevsError);
        }
        
        // Sum both counts for total buy properties
        const totalBuyCount = (resalesCount || 0) + (newDevsCount || 0);
        setBuyPropertyCount(totalBuyCount);

        // Fetch rental properties count from resales_rentals table
        // Apply same filters as rental section: exclude short-term, properties under 1000€, and older than 45 days
        const fortyFiveDaysAgo = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
        const { count: rentCount, error: rentError } = await (supabase as any)
          .from('resales_rentals')
          .select('*', { count: 'exact', head: true })
          .gt('longterm', 0)
          .gte('longterm', 1000)
          .gte('status_date', fortyFiveDaysAgo);
        
        if (rentError) {
          console.error('Error fetching rent property count:', rentError);
        } else {
          setRentPropertyCount(rentCount);
        }
      } catch (error) {
        console.error('Error fetching property counts:', error);
      }
    };

    fetchPropertyCounts();
  }, []);

  // Function to clear all filters when switching between buy/rent
  const clearAllFilters = () => {
    // Clear session storage
    sessionStorage.removeItem('propertySearchFilters');
    sessionStorage.removeItem('searchContext');
    sessionStorage.removeItem('rentalSearchContext');
    sessionStorage.removeItem('rentalPropertySortOrder');
    sessionStorage.removeItem('buyPropertySortOrder');
    sessionStorage.removeItem('currentProperties');
    
    // Clear scroll memory
    sessionStorage.removeItem('propertyListingScrollState_buy');
    sessionStorage.removeItem('propertyListingScrollState_rent');
    sessionStorage.removeItem('scrollMemory_buy');
    sessionStorage.removeItem('scrollMemory_rent');
    
    console.log('Cleared all filters when switching between buy/rent sections');
  };

  const handleBuyClick = () => {
    clearAllFilters();
    navigate('/properties');
  };

  const handleRentClick = () => {
    clearAllFilters();
    navigate('/rent');
  };

  return (
    <div className="relative">
      <HeroBackground imageUrl="https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80" />
      
      <HeroContent 
        title="Your Dream Home Awaits on the Costa del Sol"
        subtitle="Explore our vast agency network for carefully selected, always up-to-date properties to buy or rent."
      >
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <Button
            onClick={handleBuyClick}
            className="flex-1 h-20 text-lg font-semibold bg-navy-800 hover:bg-navy-900 text-white rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <div className="text-center">
              <div className="font-bold">Buy</div>
              <div className="text-sm opacity-90">
                {buyPropertyCount !== null ? `${buyPropertyCount.toLocaleString()} properties` : 'Loading...'}
              </div>
            </div>
          </Button>
          
          <Button
            onClick={handleRentClick}
            className="flex-1 h-20 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <div className="text-center">
              <div className="font-bold">Rent</div>
              <div className="text-sm opacity-90">
                {rentPropertyCount !== null ? `${rentPropertyCount.toLocaleString()} properties` : 'Loading...'}
              </div>
            </div>
          </Button>
        </div>
      </HeroContent>
    </div>
  );
};

export default Hero;
