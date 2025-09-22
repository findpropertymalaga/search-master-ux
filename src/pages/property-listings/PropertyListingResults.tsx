
import React from 'react';
import { Property } from '@/components/property/types';
import PropertyGrid from '@/components/PropertyGrid';
import { PropertyMapView } from './PropertyMapView';
import { FilterValues } from '@/components/SearchFilters';

type SortOption = 'published' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

interface PropertyListingResultsProps {
  properties: Property[];
  allProperties: Property[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  sortOrder: SortOption;
  handleSortChange: (order: SortOption) => void;
  handlePageChange: (page: number) => void;
  showMap: boolean;
  onToggleMap: () => void;
  isFullscreenMap: boolean;
  onToggleFullscreen: () => void;
  isMobile: boolean;
  error: string | null;
  currentFilters?: FilterValues;
  onFilterChange?: (filters: FilterValues) => void;
}

export const PropertyListingResults = ({
  properties,
  allProperties,
  loading,
  currentPage,
  totalPages,
  totalCount,
  sortOrder,
  handleSortChange,
  handlePageChange,
  showMap,
  onToggleMap,
  isFullscreenMap,
  onToggleFullscreen,
  isMobile,
  error,
  currentFilters,
  onFilterChange
}: PropertyListingResultsProps) => {

  // Map view rendering for mobile
  const mapView = (
    <PropertyMapView
      allProperties={allProperties}
      showMap={showMap}
      isFullscreenMap={isFullscreenMap}
      isMobile={isMobile}
      onToggleMap={onToggleMap}
      currentFilters={currentFilters}
      onFilterChange={onFilterChange}
    />
  );

  return (
    <>
      {/* Map view component - only render on mobile */}
      {isMobile && mapView}
      
      {/* Property Grid shows current page results */}
      <PropertyGrid 
        properties={properties}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        error={error}
        loading={loading}
      />
    </>
  );
};
