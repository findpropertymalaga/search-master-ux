
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const SearchButton = ({ isLoading, children }: SearchButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="bg-navy-800 hover:bg-navy-900 text-white"
      disabled={isLoading}
    >
      <Search className="h-4 w-4 mr-2" />
      Sök fastigheter
      {children}
    </Button>
  );
};

export default SearchButton;
