
import { useState, useEffect, useRef } from 'react';

interface UseLoadingStateProps {
  loading: boolean;
  initialDelay?: number;
}

/**
 * Custom hook to manage loading state with delayed visual feedback
 * to prevent UI flashing for quick loading states
 */
export const useLoadingState = ({ loading, initialDelay = 300 }: UseLoadingStateProps) => {
  const [showLoading, setShowLoading] = useState(true);
  const initialLoadCompleted = useRef(false);
  
  // Better loading state management
  useEffect(() => {
    // If we've already completed the initial load and now loading is true again,
    // it means we're refreshing due to filter changes - don't show loading state immediately
    if (initialLoadCompleted.current && loading) {
      // Only show loading state if it takes more than the initialDelay to load
      const timer = setTimeout(() => {
        if (loading) setShowLoading(true);
      }, initialDelay);
      
      return () => clearTimeout(timer);
    } else {
      // For initial load, show loading immediately
      setShowLoading(loading);
      
      // Mark initial load as completed once loading is false
      if (!loading && !initialLoadCompleted.current) {
        initialLoadCompleted.current = true;
      }
    }
  }, [loading, initialDelay]);

  // When not loading anymore, always hide the loading state
  useEffect(() => {
    if (!loading) {
      setShowLoading(false);
    }
  }, [loading]);

  return { showLoading };
};
