
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectivityDrawerProps {
  isConnected: boolean;
  onRetry?: () => void;
  className?: string;
}

export const ConnectivityDrawer = ({ 
  isConnected, 
  onRetry,
  className 
}: ConnectivityDrawerProps) => {
  if (isConnected) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-gray-100 border-b border-gray-200 shadow-sm",
      className
    )}>
      <Alert className="bg-gray-50 border-gray-200 rounded-none">
        <WifiOff className="h-4 w-4 text-gray-600" />
        <AlertDescription className="flex items-center justify-between w-full">
          <div className="flex flex-col space-y-1">
            <span className="font-medium text-gray-800">
              Connection temporarily unavailable
            </span>
            <span className="text-sm text-gray-600">
              We're having trouble connecting to our servers. Please check your internet connection.
            </span>
          </div>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="ml-4 flex-shrink-0 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};
