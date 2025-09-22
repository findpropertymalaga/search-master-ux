
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const FeaturedPropertiesLoading = () => {
  return (
    <div className="container-custom py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">Featured Properties</h2>
        <Link to="/properties">
          <Button variant="outline" className="text-navy-700 border-navy-200 hover:bg-navy-50">
            View All
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPropertiesLoading;
