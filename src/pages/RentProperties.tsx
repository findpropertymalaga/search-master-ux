import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import { useRentalPropertyData } from '@/hooks/useRentalPropertyData';
import { useOptimizedLoadingState } from '@/hooks/useOptimizedLoadingState';
import { useIsMobile } from '@/hooks/use-mobile';
import PropertySidebarFilters from '@/components/PropertySidebarFilters';
import PropertyLoadingSkeleton from '@/components/PropertyLoadingSkeleton';
import PropertyMobileControls from '@/components/PropertyMobileControls';
import ActiveFilters from '@/components/ActiveFilters';
import PropertySorting from '@/components/PropertySorting';
import { PropertyListingHeader } from './property-listings/PropertyListingHeader';
import { PropertyListingResults } from './property-listings/PropertyListingResults';
import { PropertyMapView } from './property-listings/PropertyMapView';
import { useMapVisibility } from './property-listings/useMapVisibility';
import { useScrollMemory } from '@/hooks/useScrollMemory';
import ScrollToTop from '@/components/ui/scroll-to-top';
import { storeSearchContext } from '@/hooks/useEnhancedPropertyNavigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const RentProperties = () => {
  // Use the custom hooks for property filters and data
  const { currentFilters, handleFilterChange, isInitialized } = usePropertyFilters();
  const isMobile = useIsMobile();
  
  // Get map visibility state from the custom hook
  const { 
    showMap, 
    isFullscreenMap, 
    handleToggleMap, 
    handleToggleFullscreen 
  } = useMapVisibility(isMobile);
  
  // Back to working rental hook with speed optimizations
  const { 
    properties, 
    allProperties, 
    loading, 
    totalPages, 
    totalCount, 
    sortOrder, 
    handleSortChange, 
    handlePageChange,
    error,
    mobileInitialized,
    detectedMobile,
    page
  } = useRentalPropertyData(currentFilters, isInitialized);

  // Scroll memory management for rental properties
  const { saveScrollState, isRestoring } = useScrollMemory(
    properties,
    page,
    sortOrder,
    currentFilters,
    async (pageNum: number) => {
      await new Promise(resolve => {
        handlePageChange(pageNum);
        // Wait for state update
        setTimeout(resolve, 50);
      });
    },
    'rent'
  );

  // Check if we're still initializing to prevent "No properties found" from showing too early
  const isInitializing = detectedMobile === null || !mobileInitialized;

  // Optimized loading state with faster response
  const { showLoading } = useOptimizedLoadingState({ 
    loading, 
    isInitializing,
    fastMode: true
  });

  // Store search context for enhanced navigation
  useEffect(() => {
    if (properties.length > 0 && totalCount > 0) {
      // Store current properties for backward compatibility
      sessionStorage.setItem('currentProperties', JSON.stringify(properties));
      // Store search context for enhanced navigation (mark as rental)
      storeSearchContext(currentFilters, sortOrder, totalCount, true);
      
      // Update URL with current page
      const currentUrl = new URL(window.location.href);
      if (page > 1) {
        currentUrl.searchParams.set('page', page.toString());
      } else {
        currentUrl.searchParams.delete('page');
      }
      
      // Only update URL if it's different to prevent infinite loops
      if (currentUrl.href !== window.location.href) {
        window.history.replaceState({}, '', currentUrl.href);
      }
    }
  }, [properties, currentFilters, sortOrder, totalCount, page]);
  
  // Clear saved navigation state after it's been restored
  useEffect(() => {
    if (properties.length > 0 && page > 1) {
      const storageKey = 'scrollMemory_rent';
      const savedState = sessionStorage.getItem(storageKey);
      if (savedState) {
        try {
          const navData = JSON.parse(savedState);
          if (navData.currentPage === page) {
            // Navigation state has been successfully restored, clear it
            sessionStorage.removeItem(storageKey);
            console.log(`Cleared navigation state after restoring to page ${page}`);
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    }
  }, [properties.length, page]);

  // Listen for scroll state save events from property cards
  useEffect(() => {
    const handleSaveScrollState = () => {
      saveScrollState();
    };

    window.addEventListener('saveScrollState', handleSaveScrollState);
    return () => {
      window.removeEventListener('saveScrollState', handleSaveScrollState);
    };
  }, [saveScrollState]);


  // No need for mobile detection loading with optimized approach

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PropertyListingHeader 
          title="Upptäck hyresfastigheter på Costa del Sol"
        />

        <div className="container-custom py-8 pb-24">
          {/* Breadcrumb Navigation for Mobile */}
          <div className="mb-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">HEM</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>HYR</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Active Filter Badges - show on mobile when filters are active */}
          <ActiveFilters 
            currentFilters={currentFilters}
            onFilterChange={handleFilterChange}
          />

          {/* Search Results Count for Mobile */}
          <div className="text-sm text-gray-600 flex items-center mb-4">
            Visar <span className="font-medium ml-1">{totalCount}</span> <span className="ml-1">hyresfastigheter</span>
          </div>

          {/* Results */}
          {showLoading ? (
            <PropertyLoadingSkeleton />
          ) : (
            <PropertyListingResults 
              properties={properties}
              allProperties={allProperties}
              loading={loading || isInitializing}
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              sortOrder={sortOrder}
              handleSortChange={handleSortChange}
              handlePageChange={handlePageChange}
              showMap={showMap}
              onToggleMap={handleToggleMap}
              isFullscreenMap={isFullscreenMap}
              onToggleFullscreen={handleToggleFullscreen}
              isMobile={isMobile}
              error={error}
              currentFilters={currentFilters}
              onFilterChange={handleFilterChange}
            />
          )}
        </div>
        
        {/* Mobile controls - always visible on mobile with improved touch handling */}
          <PropertyMobileControls
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            showMap={showMap}
            onToggleMap={handleToggleMap}
            isFullscreenMap={isFullscreenMap}
            onToggleFullscreen={handleToggleFullscreen}
            currentFilters={currentFilters}
            onFilterChange={handleFilterChange}
            totalCount={totalCount}
            isRentalPage={true}
          />

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PropertyListingHeader 
        title="Upptäck hyresfastigheter på Costa del Sol"
      />

      <div className="container-custom py-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters (1/4 of the page) - Non-sticky */}
          <div className="w-1/4 min-w-[300px]">
            {/* Breadcrumb Navigation */}
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">HEM</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>HYR</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            <PropertySidebarFilters 
              onFilterChange={handleFilterChange} 
              currentFilters={currentFilters} 
              isRentalPage={true}
            />
          </div>

          {/* Right Content Area (3/4 of the page) */}
          <div className="flex-1">
            {/* Active Filter Badges */}
            <ActiveFilters 
              currentFilters={currentFilters}
              onFilterChange={handleFilterChange}
            />

            {/* Top Controls - Search Results Count */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600 flex items-center">
                Visar <span className="font-medium ml-1">{totalCount}</span> <span className="ml-1">hyresfastigheter</span>
              </div>
            </div>

            {/* Map View */}
            <div className="mb-6">
              <PropertyMapView 
                allProperties={allProperties}
                showMap={true}
                isFullscreenMap={false}
                isMobile={false}
                onToggleMap={handleToggleMap}
                currentFilters={currentFilters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Sorting Controls - Below Map */}
            <div className="flex justify-end items-center mb-6">
              <PropertySorting 
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                className="mb-0"
              />
            </div>

            {/* Results */}
            {showLoading ? (
              <PropertyLoadingSkeleton />
            ) : (
              <PropertyListingResults 
                properties={properties}
                allProperties={allProperties}
                loading={loading || isInitializing}
                currentPage={page}
                totalPages={totalPages}
                totalCount={totalCount}
                sortOrder={sortOrder}
                handleSortChange={handleSortChange}
                handlePageChange={handlePageChange}
                showMap={false} // Don't show map toggle in results since map is always visible
                onToggleMap={handleToggleMap}
                isFullscreenMap={isFullscreenMap}
                onToggleFullscreen={handleToggleFullscreen}
                isMobile={isMobile}
                error={error}
              />
            )}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default RentProperties;