
import { useRef, useEffect } from 'react';

/**
 * Custom hook to manage filter synchronization state
 */
export const useFilterSync = () => {
  const isUpdatingRef = useRef(false);
  const filterChangeTimeoutRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  // Mark component as mounted/unmounted
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Clear any pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (filterChangeTimeoutRef.current) {
        clearTimeout(filterChangeTimeoutRef.current);
      }
    };
  }, []);

  return {
    isUpdatingRef,
    filterChangeTimeoutRef,
    mountedRef
  };
};
