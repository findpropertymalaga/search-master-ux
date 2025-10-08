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
  console.log('🌍 LanguageProvider MOUNTED - window.location.search:', window.location.search);
  
  // Read language from URL parameter for initial load
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

  // Listen for language changes via postMessage from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate the message structure
      if (
        event.data && 
        event.data.type === 'LANGUAGE_CHANGE' && 
        event.data.language &&
        ['en', 'sv'].includes(event.data.language)
      ) {
        console.log('[LanguageContext] Language updated via postMessage:', event.data.language);
        setLanguage(event.data.language as Language);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
