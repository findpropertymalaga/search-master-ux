// Area center coordinates for Costa del Sol locations
export interface AreaCoordinates {
  lat: number;
  lng: number;
}

// Mapping of area names to their center coordinates
export const AREA_COORDINATES: Record<string, AreaCoordinates> = {
  // Major centers
  'Estepona Centro': { lat: 36.4285, lng: -5.1451 },
  'Marbella Centro': { lat: 36.5098, lng: -4.8869 },
  'Nueva Andalucía': { lat: 36.4944, lng: -4.9402 },
  'Fuengirola Centro': { lat: 36.5392, lng: -4.6254 },
  'Benahavís Centro': { lat: 36.5330, lng: -5.0359 },
  'Mijas Centro': { lat: 36.5924, lng: -4.6386 },
  'Benalmadena Centro': { lat: 36.5988, lng: -4.5162 },
  'San Pedro de Alcántara': { lat: 36.4875, lng: -4.9969 },
  'The Golden Mile': { lat: 36.5024, lng: -4.9155 },
  'Puerto Banús': { lat: 36.4842, lng: -4.9517 },
  'Elviria': { lat: 36.4888, lng: -4.8067 },
  'Calahonda': { lat: 36.4775, lng: -4.7095 },
  'Manilva Centro': { lat: 36.3433, lng: -5.2461 },
  'Alhaurín el Grande Centro': { lat: 36.6326, lng: -4.6868 },
  'Riviera del Sol': { lat: 36.4742, lng: -4.7442 },
  'La Cala de Mijas': { lat: 36.4913, lng: -4.6854 },
  'Mijas Costa': { lat: 36.5166, lng: -4.6321 },
  'Benalmadena Costa': { lat: 36.5891, lng: -4.5433 },
  'La Duquesa': { lat: 36.3575, lng: -5.2189 },
  'New Golden Mile': { lat: 36.4724, lng: -4.9755 },
  
  // Additional popular areas
  'Torremolinos Centro': { lat: 36.6204, lng: -4.4996 },
  'Casares Centro': { lat: 36.4444, lng: -5.2758 },
  'Ojén Centro': { lat: 36.5580, lng: -4.8656 },
  'Istán Centro': { lat: 36.6127, lng: -4.9367 },
  'Cancelada': { lat: 36.4691, lng: -5.0107 },
  'Guadalmina': { lat: 36.4816, lng: -5.0317 },
  'Bahía de Marbella': { lat: 36.4751, lng: -4.9285 },
  'Cabopino': { lat: 36.4744, lng: -4.7442 },
  'Calypso': { lat: 36.4811, lng: -4.7058 },
  'El Paraiso': { lat: 36.4669, lng: -5.0169 },
  'Las Chapas': { lat: 36.4838, lng: -4.7915 },
  'Sierra Blanca': { lat: 36.5141, lng: -4.8735 },
  'Artola': { lat: 36.4744, lng: -4.7442 },
  'Bahía Dorada': { lat: 36.4744, lng: -4.7442 },
  'Guadalmansa': { lat: 36.4691, lng: -5.0107 },
  'Hacienda las Chapas': { lat: 36.4838, lng: -4.7915 },
  'Los Monteros': { lat: 36.4888, lng: -4.8067 },
  'Río Real': { lat: 36.4888, lng: -4.8067 },
  'Saladillo': { lat: 36.4691, lng: -5.0107 },
  'Sotogrande': { lat: 36.2935, lng: -5.2770 },
  'Torrequebrada': { lat: 36.5891, lng: -4.5433 },
  'Torreblanca': { lat: 36.5392, lng: -4.6254 },
  'La Carihuela': { lat: 36.6137, lng: -4.5014 },
  'Montemar': { lat: 36.5988, lng: -4.5162 },
  'Arroyo de la Miel': { lat: 36.6014, lng: -4.5314 },
  'Miraflores': { lat: 36.4775, lng: -4.7095 },
  'La Cala del Moral': { lat: 36.7144, lng: -4.3306 },
  'Rincón de la Victoria': { lat: 36.7118, lng: -4.2725 },
  
  // Málaga area
  'Málaga Centro': { lat: 36.7213, lng: -4.4214 },
  'Pedregalejo': { lat: 36.7309, lng: -4.3623 },
  'El Palo': { lat: 36.7337, lng: -4.3457 },
  'Churriana': { lat: 36.6624, lng: -4.5044 },
  'Alhaurín de la Torre': { lat: 36.6645, lng: -4.5616 },
  
  // Eastern areas
  'Nerja Centro': { lat: 36.7572, lng: -3.8749 },
  'Torre del Mar': { lat: 36.7438, lng: -4.0997 },
  'Torrox Costa': { lat: 36.7328, lng: -3.9553 },
  'Frigiliana': { lat: 36.7925, lng: -3.8975 },
  'Competa': { lat: 36.8364, lng: -3.9747 },
  'Algarrobo': { lat: 36.8364, lng: -4.0314 },
  'Vélez-Málaga': { lat: 36.7759, lng: -4.1025 },
  
  // Additional missing areas from console logs
  'Centro Histórico': { lat: 36.7213, lng: -4.4214 }, // Málaga historical center
  'Carvajal': { lat: 36.5392, lng: -4.6254 }, // Fuengirola area
  'Los Alamos': { lat: 36.5392, lng: -4.6254 }, // Fuengirola area  
  'Torremuelle': { lat: 36.5891, lng: -4.5433 }, // Benalmádena area
  'Los Pacos': { lat: 36.5392, lng: -4.6254 }, // Fuengirola area
  'Martiricos': { lat: 36.7213, lng: -4.4214 }, // Málaga neighborhood
  'Benalmadena Pueblo': { lat: 36.5988, lng: -4.5162 }, // Benalmádena village
  'El Pinillo': { lat: 36.5891, lng: -4.5433 }, // Torremolinos area
  'El Candado': { lat: 36.7213, lng: -4.4214 }, // Málaga area
  'Selwo': { lat: 36.4285, lng: -5.1451 }, // Estepona area
  'Entrerrios': { lat: 36.4775, lng: -4.7095 }, // Mijas area
  'Guadalmina Baja': { lat: 36.4816, lng: -5.0317 }, // San Pedro area
  'La Cala': { lat: 36.4913, lng: -4.6854 }, // La Cala de Mijas
  'El Faro': { lat: 36.4775, lng: -4.7095 }, // Calahonda area
  'Reserva de Marbella': { lat: 36.5098, lng: -4.8869 }, // Marbella area
  'Carranque': { lat: 36.7213, lng: -4.4214 }, // Málaga neighborhood
  'Limonar': { lat: 36.7213, lng: -4.4214 }, // Málaga neighborhood
  'Rincón de la Victoria Centro': { lat: 36.7118, lng: -4.2725 },
  'El Tomillar': { lat: 36.5924, lng: -4.6386 }, // Mijas area
  'Mijas Golf': { lat: 36.5924, lng: -4.6386 }, // Mijas golf area
  'La Quinta': { lat: 36.4944, lng: -4.9402 }, // Nueva Andalucía area
  'Vélez-Málaga Centro': { lat: 36.7759, lng: -4.1025 },
  'Los Almendros': { lat: 36.5924, lng: -4.6386 }, // Mijas area
  'San Luis de Sabinillas': { lat: 36.3433, lng: -5.2461 }, // Manilva area
  'Hacienda Las Chapas': { lat: 36.4838, lng: -4.7915 }, // Las Chapas area
  'Antequera Centro': { lat: 37.0179, lng: -4.5585 }, // Antequera
  
  // Town mappings (for fallback when area not found)
  'Estepona': { lat: 36.4285, lng: -5.1451 },
  'Marbella': { lat: 36.5098, lng: -4.8869 },
  'Fuengirola': { lat: 36.5392, lng: -4.6254 },
  'Benahavís': { lat: 36.5330, lng: -5.0359 },
  'Mijas': { lat: 36.5924, lng: -4.6386 },
  'Benalmadena': { lat: 36.5988, lng: -4.5162 },
  'Benalmádena': { lat: 36.5988, lng: -4.5162 },
  'Torremolinos': { lat: 36.6204, lng: -4.4996 },
  'Casares': { lat: 36.4444, lng: -5.2758 },
  'Ojén': { lat: 36.5580, lng: -4.8656 },
  'Istán': { lat: 36.6127, lng: -4.9367 },
  'Manilva': { lat: 36.3433, lng: -5.2461 },
  'Málaga': { lat: 36.7213, lng: -4.4214 },
  'Nerja': { lat: 36.7572, lng: -3.8749 },
  'Torrox': { lat: 36.7328, lng: -3.9553 },
  'Antequera': { lat: 37.0179, lng: -4.5585 }
};

// Generate random coordinates within approximately 1km radius of center
export const generateRandomCoordinatesInArea = (centerLat: number, centerLng: number): AreaCoordinates => {
  // 1km ≈ 0.009 degrees (approximate)
  const radiusInDegrees = 0.009;
  
  // Generate random angle and distance
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusInDegrees;
  
  // Calculate offset
  const deltaLat = distance * Math.cos(angle);
  const deltaLng = distance * Math.sin(angle);
  
  return {
    lat: centerLat + deltaLat,
    lng: centerLng + deltaLng
  };
};

// Get coordinates for a property based on its area, with random positioning
export const getPropertyCoordinates = (area: string): AreaCoordinates | null => {
  const areaCenter = AREA_COORDINATES[area];
  if (!areaCenter) {
    console.warn(`No coordinates found for area: ${area}`);
    return null;
  }
  
  // Generate random coordinates within 1km of the area center
  return generateRandomCoordinatesInArea(areaCenter.lat, areaCenter.lng);
};

// Get center coordinates for an area (without randomization)
export const getAreaCenterCoordinates = (area: string): AreaCoordinates | null => {
  return AREA_COORDINATES[area] || null;
};