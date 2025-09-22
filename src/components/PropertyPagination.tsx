import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const PropertyPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  loading = false 
}: PropertyPaginationProps) => {
  if (totalPages <= 1) return null;

  // Calculate visible page numbers (up to 7 pages)
  const getVisiblePages = () => {
    const maxVisible = 7;
    const pages: number[] = [];
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination for more than 7 pages
      const start = Math.max(1, Math.min(currentPage - 3, totalPages - maxVisible + 1));
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const showPrevious = currentPage > 1;
  const showNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* First Page Double Arrow */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || loading}
        className={cn(
          "h-9 w-9 p-0",
          currentPage === 1 && "invisible"
        )}
        title="Go to first page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Previous Arrow */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!showPrevious || loading}
        className={cn(
          "h-9 w-9 p-0",
          !showPrevious && "invisible"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={cn(
              "h-9 min-w-[36px] px-3",
              page === currentPage && "bg-primary text-primary-foreground"
            )}
          >
            {page}
          </Button>
        ))}
      </div>

      {/* Next Arrow */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!showNext || loading}
        className={cn(
          "h-9 w-9 p-0",
          !showNext && "invisible"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PropertyPagination;