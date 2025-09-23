
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PropertyLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-costa-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading property details...</p>
    </div>
  </div>
);

export const PropertyNotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-800 mb-2">
          Property not found
        </h1>
        <p className="text-gray-600">
          The property you are looking for does not exist or has been removed.
        </p>
      </div>
      
      <div className="space-y-3">
        <Link to="/properties">
          <Button className="w-full bg-costa-600 hover:bg-costa-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka till sökning
          </Button>
        </Link>
        
        <Link to="/">
          <Button variant="outline" className="w-full">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export const PropertyDetailLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="container-custom py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/properties" className="text-costa-600 hover:text-costa-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Tillbaka till sökning
        </Link>
      </div>
      
      {children}
    </div>
  </div>
);
