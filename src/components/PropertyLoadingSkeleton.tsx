
import { Skeleton } from '@/components/ui/skeleton';
import { Loader } from 'lucide-react';

interface PropertyLoadingSkeletonProps {
  loading?: boolean;
}

const PropertyLoadingSkeleton = ({ 
  loading = true
}: PropertyLoadingSkeletonProps) => {
  return (
    <div className="space-y-6">
      {/* Simple loading indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-3">
          <Loader className="h-6 w-6 animate-spin text-costa-600" />
          <span className="text-lg font-medium text-costa-700">
            Loading...
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="h-5 bg-costa-200 rounded w-40 animate-pulse"></div>
        <div className="h-9 bg-costa-200 rounded w-44 animate-pulse"></div>
      </div>
      <div className="property-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="pt-4 space-y-3">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyLoadingSkeleton;
