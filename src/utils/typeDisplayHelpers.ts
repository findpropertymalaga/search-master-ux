export const getPropertyTypeDisplay = (type: string | string[]): string => {
  if (Array.isArray(type)) {
    if (type.length === 0) return 'All types';
    if (type.length === 1) {
      return getSingleTypeDisplay(type[0]);
    }
    return `${type.length} types selected`;
  }
  
  return getSingleTypeDisplay(type);
};

const getSingleTypeDisplay = (type: string): string => {
  switch (type?.toLowerCase()) {
    case 'apartment':
      return 'Apartment';
    case 'house':
      return 'House';
    case 'plot':
      return 'Plot';
    case 'commercial':
      return 'Commercial';
    case 'new-devs':
      return 'New Devs';
    case 'short-term':
      return 'Short-term';
    case 'long-term':
      return 'Long-term';
    case 'penthouse':
      return 'Penthouse';
    case 'ground-floor':
      return 'Ground Floor';
    case 'duplex':
      return 'Duplex';
    case 'any':
      return 'All types';
    default:
      return type || 'All types';
  }
};