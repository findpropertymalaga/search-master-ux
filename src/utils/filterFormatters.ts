
/**
 * Utility functions for formatting filter values for display
 */

// Function to format bedroom/bathroom counts for display
export const formatRoomCount = (value: string): string => {
  return `${value}+ ${value === '1' ? '' : ''}`;
};

// Get the property type display name
export const getPropertyTypeDisplay = (type: string): string => {
  const types: Record<string, string> = {
    'apartment': 'Apartment',
    'villa': 'Villa',
    'house': 'House',
    'land': 'Land',
  };
  
  return types[type] || type;
};

// Function to format price for display
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
};
