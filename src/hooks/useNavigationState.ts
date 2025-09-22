
import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * This hook helps track and manage navigation state changes
 * to ensure filter persistence between page views
 */
export const useNavigationState = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  
  useEffect(() => {
    // Save the current URL to session storage when navigating away from property listings
    if (location.pathname === '/properties') {
      console.log("Saving property listing URL state:", location.search);
      sessionStorage.setItem('lastPropertyListingSearch', location.search);
    }
    
    // When navigating back to the property listings, this helps with debugging
    if (location.pathname === '/properties' && navigationType === 'POP') {
      console.log("Navigated back to property listings with:", location.search);
      console.log("Previously saved search:", sessionStorage.getItem('lastPropertyListingSearch'));
    }
  }, [location, navigationType]);
  
  return {
    isNavigatingBack: navigationType === 'POP',
    currentPathname: location.pathname,
    searchParams: location.search
  };
};
