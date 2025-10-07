import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, TranslationKey } from '@/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Read language from URL parameter
  const getLanguageFromUrl = (): Language => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang');
    return (langParam === 'en' || langParam === 'sv') ? langParam : 'sv'; // Default to Swedish
  };

  const [language, setLanguage] = useState<Language>(getLanguageFromUrl());

  // Update language when URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const newLang = getLanguageFromUrl();
      if (newLang !== language) {
        setLanguage(newLang);
      }
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleUrlChange);
    
    // Listen for custom language change events
    window.addEventListener('languagechange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('languagechange', handleUrlChange);
    };
  }, [language]);

  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
