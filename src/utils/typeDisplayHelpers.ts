import { translations } from '@/i18n/translations';

export const getPropertyTypeDisplay = (type: string | string[], language: 'en' | 'sv' = 'sv'): string => {
  if (Array.isArray(type)) {
    if (type.length === 0) return translations[language].allTypes;
    if (type.length === 1) {
      return getSingleTypeDisplay(type[0], language);
    }
    return language === 'sv' ? `${type.length} typer valda` : `${type.length} types selected`;
  }
  
  return getSingleTypeDisplay(type, language);
};

const getSingleTypeDisplay = (type: string, language: 'en' | 'sv' = 'sv'): string => {
  const typeMap: Record<string, keyof typeof translations.en> = {
    'apartment': 'apartment',
    'house': 'house',
    'plot': 'plot',
    'commercial': 'commercial',
    'new-devs': 'newDevs',
    'short-term': 'shortTerm',
    'long-term': 'longTerm',
    'penthouse': 'penthouse',
    'ground-floor': 'groundFloor',
    'duplex': 'duplex',
    'any': 'allTypes'
  };

  const key = typeMap[type?.toLowerCase()];
  if (key) {
    return translations[language][key];
  }
  
  return type || translations[language].allTypes;
};