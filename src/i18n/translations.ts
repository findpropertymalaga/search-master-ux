export const translations = {
  en: {
    // Navbar
    home: 'Home',
    buy: 'Buy',
    rent: 'Rent',
    about: 'About us',
    newsletter: 'Newsletter',
    
    // Hero
    heroTitle: 'Your dream home awaits on Costa del Sol',
    heroSubtitle: 'Explore our extensive network of carefully selected, always updated properties to buy or rent.',
    properties: 'properties',
    loading: 'Loading...',
    
    // Sorting
    sortBy: 'Sort by:',
    recentlyUpdated: 'Recently updated',
    priceLowToHigh: 'Price: Low to high',
    priceHighToLow: 'Price: High to low',
    sizeSmallToLarge: 'Size: Small to large',
    sizeLargeToSmall: 'Size: Large to small',
    
    // Newsletter modal
    newsletterTitle: 'Stay updated',
    newsletterDescription: 'Subscribe to receive the latest property updates and market insights.',
    enterEmail: 'Enter your email address',
    subscribeNow: 'Subscribe now',
    thankYou: 'Thank you for subscribing! We\'ll keep you updated.',
    somethingWrong: 'Something went wrong. Please try again.',
    
    // Property types
    apartment: 'Apartment',
    house: 'House',
    plot: 'Plot',
    commercial: 'Commercial',
    newDevs: 'New development',
    shortTerm: 'Short-term',
    longTerm: 'Long-term',
    penthouse: 'Penthouse',
    groundFloor: 'Ground floor',
    duplex: 'Duplex',
    allTypes: 'All types',
    
    // Common
    selectSorting: 'Select sorting',
  },
  sv: {
    // Navbar
    home: 'Hem',
    buy: 'Köp',
    rent: 'Hyr',
    about: 'Om oss',
    newsletter: 'Nyhetsbrev',
    
    // Hero
    heroTitle: 'Ditt drömhem väntar på Costa del Sol',
    heroSubtitle: 'Utforska vårt omfattande nätverk av noga utvalda, alltid uppdaterade fastigheter att köpa eller hyra.',
    properties: 'fastigheter',
    loading: 'Laddar...',
    
    // Sorting
    sortBy: 'Sortera efter:',
    recentlyUpdated: 'Senast uppdaterad',
    priceLowToHigh: 'Pris: Lågt till högt',
    priceHighToLow: 'Pris: Högt till lågt',
    sizeSmallToLarge: 'Storlek: Liten till stor',
    sizeLargeToSmall: 'Storlek: Stor till liten',
    
    // Newsletter modal
    newsletterTitle: 'Håll dig uppdaterad',
    newsletterDescription: 'Prenumerera för att få de senaste fastighetsuppdateringarna och marknadsinsikterna.',
    enterEmail: 'Ange din e-postadress',
    subscribeNow: 'Prenumerera nu',
    thankYou: 'Tack för din prenumeration! Vi håller dig uppdaterad.',
    somethingWrong: 'Något gick fel. Försök igen.',
    
    // Property types
    apartment: 'Lägenhet',
    house: 'Hus',
    plot: 'Tomt',
    commercial: 'Kommersiell',
    newDevs: 'Nybygge',
    shortTerm: 'Korttid',
    longTerm: 'Långtid',
    penthouse: 'Takvåning',
    groundFloor: 'Bottenvåning',
    duplex: 'Duplex',
    allTypes: 'Alla typer',
    
    // Common
    selectSorting: 'Välj sortering',
  }
};

export type Language = 'en' | 'sv';
export type TranslationKey = keyof typeof translations.en;
