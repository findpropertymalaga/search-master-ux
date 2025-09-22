
export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  plotSize?: number;
  images: string[];
  description: string;
  features: string[];
  propertyType: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  yearBuilt?: number | null;
  energyRating?: string;
  parking: boolean;
  garden: boolean;
  pool: boolean;
  status: string;
  listedDate?: string;
  currency: string;
  province: string;
  town: string;
  urbanisation: string;
  developmentName: string;
  subtype?: string;
  // Rental-specific fields
  shortterm_low?: number;
  longterm?: number;
  // Legacy fields for backward compatibility
  type?: string;
  imageUrl?: string | string[];
  latitude?: number;
  longitude?: number;
  propertyRef?: string;
  terrace?: number;
  listed_date?: string;
  status_date?: string;
}

// This is used to extend the base Property interface with additional fields
export interface DetailedProperty extends Property {
  // Additional detailed fields can be added here if needed
}
