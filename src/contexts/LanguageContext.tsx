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
    console.log('[LanguageContext] URL search params:', window.location.search);
    console.log('[LanguageContext] Lang parameter received:', langParam);
    const resolvedLang = (langParam === 'en' || langParam === 'sv') ? langParam : 'sv';
    console.log('[LanguageContext] Resolved language:', resolvedLang);
    return resolvedLang;
  };

  const [language, setLanguage] = useState<Language>(() => {
    const lang = getLanguageFromUrl();
    console.log('[LanguageContext] Initial language set to:', lang);
    return lang;
  });

  // Update language when URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      console.log('[LanguageContext] URL change detected');
      const newLang = getLanguageFromUrl();
      console.log('[LanguageContext] New language from URL:', newLang, 'Current language:', language);
      if (newLang !== language) {
        console.log('[LanguageContext] Language changed to:', newLang);
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
    const translated = translations[language][key] || key;
    return translated;
  };

  // Log language changes
  useEffect(() => {
    console.log('[LanguageContext] Active language:', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
