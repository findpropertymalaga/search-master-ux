
import { useState, useEffect, useCallback } from 'react';

export const useMapVisibility = (isMobile: boolean) => {
  const [showMap, setShowMap] = useState(false);
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);

  useEffect(() => {
    const savedMapVisibility = sessionStorage.getItem('propertyMapVisible');
    if (savedMapVisibility !== null) {
      setShowMap(savedMapVisibility === 'true');
    } else {
      setShowMap(!isMobile);
    }
  }, [isMobile]);

  useEffect(() => {
    sessionStorage.setItem('propertyMapVisible', showMap.toString());
    
    if (!showMap) {
      setIsFullscreenMap(false);
    }
    
    // Trigger resize for map rendering
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, [showMap]);

  const handleToggleMap = useCallback(() => {
    console.log("=== TOGGLE MAP CALLED ===");
    console.log("Current showMap state:", showMap);
    console.log("Mobile device:", isMobile);
    console.log("Stack trace:");
    console.trace();
    
    setShowMap(prev => {
      const newState = !prev;
      console.log(`Map visibility changed from ${prev} to: ${newState}`);
      
      // On mobile, when showing map, go directly to fullscreen
      if (isMobile && newState) {
        console.log("Setting fullscreen map for mobile");
        setIsFullscreenMap(true);
      }
      
      return newState;
    });
  }, [isMobile, showMap]);

  const handleToggleFullscreen = useCallback(() => {
    console.log("Toggling fullscreen mode");
    
    setIsFullscreenMap(prev => {
      const newState = !prev;
      
      if (newState && !showMap) {
        setShowMap(true);
      }
      
      return newState;
    });
  }, [showMap]);

  return {
    showMap,
    isFullscreenMap,
    handleToggleMap,
    handleToggleFullscreen
  };
};
