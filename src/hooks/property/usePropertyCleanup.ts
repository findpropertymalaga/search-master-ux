
import { useEffect, MutableRefObject } from 'react';

interface CleanupRefs {
  isMountedRef: MutableRefObject<boolean>;
  abortController: MutableRefObject<AbortController | null>;
  fetchTimeoutRef: MutableRefObject<number | null>;
}

export const usePropertyCleanup = (refs: CleanupRefs) => {
  const { isMountedRef, abortController, fetchTimeoutRef } = refs;
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      
      if (abortController.current) {
        abortController.current.abort();
      }
      
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [isMountedRef, abortController, fetchTimeoutRef]);
};
