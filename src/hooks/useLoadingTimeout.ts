
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseLoadingTimeoutProps {
  loading: boolean;
  timeout?: number;
  onRetry?: () => void;
  maxRetries?: number;
}

export const useLoadingTimeout = ({ 
  loading, 
  timeout = 15000, 
  onRetry,
  maxRetries = 3 
}: UseLoadingTimeoutProps) => {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (loading) {
      setShowTimeoutMessage(false);
      
      timeoutRef.current = setTimeout(() => {
        if (loading) {
          setShowTimeoutMessage(true);
          
          if (retryCount < maxRetries && onRetry) {
            // Show retry toast with countdown
            toast({
              title: `Loading timeout (attempt ${retryCount + 1}/${maxRetries + 1})`,
              description: "Retrying automatically in 3 seconds...",
              variant: "destructive",
              duration: 3000,
            });
            
            // Auto-retry after 3 seconds with exponential backoff
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              onRetry();
            }, 3000);
          } else {
            // Final timeout message
            toast({
              title: "Loading failed after multiple attempts",
              description: "Please refresh your browser to reconnect to the search service.",
              variant: "destructive",
              duration: 15000,
            });
          }
        }
      }, timeout * Math.pow(1.5, retryCount)); // Exponential backoff
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setShowTimeoutMessage(false);
      // Reset retry count on successful load
      if (retryCount > 0) {
        setRetryCount(0);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading, timeout, toast, retryCount, maxRetries, onRetry]);

  return { 
    showTimeoutMessage, 
    retryCount,
    isRetrying: retryCount > 0 && retryCount < maxRetries
  };
};
