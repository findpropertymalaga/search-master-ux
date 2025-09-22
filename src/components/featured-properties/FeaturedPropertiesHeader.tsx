
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const FeaturedPropertiesHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">Featured Properties</h2>
      <Link to="/properties">
        <Button variant="outline" className="text-navy-700 border-navy-200 hover:bg-navy-50">
          View All
        </Button>
      </Link>
    </div>
  );
};

export default FeaturedPropertiesHeader;
