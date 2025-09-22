import { useState, useEffect } from 'react';

interface PropertyNavigation {
  previousPropertyId: string | null;
  nextPropertyId: string | null;
  currentIndex: number;
  totalProperties: number;
  loading: boolean;
}

export const usePropertyNavigation = (currentPropertyId: string): PropertyNavigation => {
  console.log('=== PROPERTY NAVIGATION INIT ===');
  console.log('Current property ID:', currentPropertyId);
  
  // Calculate navigation from stored scroll memory which contains the actual property list
  const [navigation, setNavigation] = useState<PropertyNavigation>({
    previousPropertyId: null,
    nextPropertyId: null,
    currentIndex: -1,
    totalProperties: 0,
    loading: true
  });

  useEffect(() => {
    if (!currentPropertyId) return;
    
    // Get the stored properties from sessionStorage
    const getStoredProperties = () => {
      try {
        // First try to get from current session
        const currentProperties = sessionStorage.getItem('currentProperties');
        if (currentProperties) {
          const properties = JSON.parse(currentProperties);
          console.log('Found current properties:', properties.length);
          return properties;
        }
        
        // Fallback to scroll memory
        const buyScrollState = sessionStorage.getItem('scrollMemory_buy');
        const rentScrollState = sessionStorage.getItem('scrollMemory_rent');
        
        let storedProperties = [];
        
        // Try buy properties first
        if (buyScrollState) {
          const buyData = JSON.parse(buyScrollState);
          if (buyData.properties && Array.isArray(buyData.properties)) {
            storedProperties = buyData.properties;
            console.log('Found buy properties in scroll memory:', storedProperties.length);
          }
        }
        
        // If not found in buy or if this is from rent page, try rent properties  
        if (storedProperties.length === 0 && rentScrollState) {
          const rentData = JSON.parse(rentScrollState);
          if (rentData.properties && Array.isArray(rentData.properties)) {
            storedProperties = rentData.properties;
            console.log('Found rent properties in scroll memory:', storedProperties.length);
          }
        }
        
        return storedProperties;
      } catch (error) {
        console.error('Error getting stored properties:', error);
        return [];
      }
    };

    const storedProperties = getStoredProperties();
    console.log('Total stored properties:', storedProperties.length);
    
    if (storedProperties.length > 0) {
      const currentIndex = storedProperties.findIndex(prop => prop.id === currentPropertyId);
      console.log('Found current property at index:', currentIndex);
      
      let previousPropertyId: string | null = null;
      let nextPropertyId: string | null = null;

      if (currentIndex > 0) {
        previousPropertyId = storedProperties[currentIndex - 1].id;
      }
      
      if (currentIndex >= 0 && currentIndex < storedProperties.length - 1) {
        nextPropertyId = storedProperties[currentIndex + 1].id;
      }

      console.log('Navigation calculated - Previous:', previousPropertyId, 'Next:', nextPropertyId);

      setNavigation({
        previousPropertyId,
        nextPropertyId,
        currentIndex,
        totalProperties: storedProperties.length,
        loading: false
      });
    } else {
      console.log('No stored properties found, navigation disabled');
      setNavigation({
        previousPropertyId: null,
        nextPropertyId: null,
        currentIndex: -1,
        totalProperties: 0,
        loading: false
      });
    }
  }, [currentPropertyId]);

  return navigation;
};