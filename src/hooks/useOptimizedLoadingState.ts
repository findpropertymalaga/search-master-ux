import { useState, useEffect } from 'react';

interface UseOptimizedLoadingStateProps {
  loading: boolean;
  isInitializing?: boolean;
  fastMode?: boolean;
}

/**
 * Optimized loading state hook with minimal delays for better perceived performance
 */
export const useOptimizedLoadingState = ({ 
  loading, 
  isInitializing = false,
  fastMode = false 
}: UseOptimizedLoadingStateProps) => {
  const [showLoading, setShowLoading] = useState(loading || isInitializing);
  
  useEffect(() => {
    if (loading || isInitializing) {
      // In fast mode, show loading immediately
      if (fastMode) {
        setShowLoading(true);
      } else {
        // Minimal delay only for subsequent loads to prevent flickering
        const timer = setTimeout(() => {
          setShowLoading(true);
        }, 150); // Reduced from 400ms to 150ms
        
        return () => clearTimeout(timer);
      }
    } else {
      // Always hide loading immediately when done
      setShowLoading(false);
    }
  }, [loading, isInitializing, fastMode]);

  return { showLoading };
};