export const getPropertyTypeDisplay = (type: string | string[]): string => {
  if (Array.isArray(type)) {
    if (type.length === 0) return 'Alla typer';
    if (type.length === 1) {
      return getSingleTypeDisplay(type[0]);
    }
    return `${type.length} typer valda`;
  }
  
  return getSingleTypeDisplay(type);
};

const getSingleTypeDisplay = (type: string): string => {
  switch (type?.toLowerCase()) {
    case 'apartment':
      return 'Lägenhet';
    case 'house':
      return 'Hus';
    case 'plot':
      return 'Tomt';
    case 'commercial':
      return 'Kommersiell';
    case 'new-devs':
      return 'Nybygge';
    case 'short-term':
      return 'Korttid';
    case 'long-term':
      return 'Långtid';
    case 'penthouse':
      return 'Takvåning';
    case 'ground-floor':
      return 'Bottenvåning';
    case 'duplex':
      return 'Duplex';
    case 'any':
      return 'Alla typer';
    default:
      return type || 'Alla typer';
  }
};