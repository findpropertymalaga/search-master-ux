
export const extractKeyFeatures = (description: string): string[] => {
  if (!description || description.trim().length === 0) {
    return [];
  }
  
  // Keywords that typically indicate important features in English property descriptions
  const featureKeywords = [
    'terrace', 'balcony', 'sea view', 'pool', 'garage', 'parking', 'air conditioning', 
    'heating', 'fireplace', 'garden', 'elevator', 'security', 'near to', 'next to', 'beach',
    'center', 'shop', 'restaurant', 'transport', 'school', 'hospital', 'airport',
    'golf', 'port', 'marina', 'gym', 'spa', 'jacuzzi', 'solarium',
    'basement', 'attic', 'storage', 'laundry', 'built-in wardrobes', 'furnished'
  ];
  
  // Split description into sentences
  const sentences = description
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);
  
  const features: string[] = [];
  
  // Look for sentences containing feature keywords
  sentences.forEach(sentence => {
    const lowerSentence = sentence.toLowerCase();
    
    // Check if sentence contains any feature keywords
    const hasFeatureKeyword = featureKeywords.some(keyword => 
      lowerSentence.includes(keyword.toLowerCase())
    );
    
    if (hasFeatureKeyword && sentence.length < 150) {
      // Clean up the sentence
      let cleanSentence = sentence
        .replace(/^[,-\s]+/, '') // Remove leading punctuation/spaces
        .replace(/[,-\s]+$/, '') // Remove trailing punctuation/spaces
        .trim();
      
      // Capitalize first letter
      if (cleanSentence.length > 0) {
        cleanSentence = cleanSentence.charAt(0).toUpperCase() + cleanSentence.slice(1);
        features.push(cleanSentence);
      }
    }
  });
  
  // If we have too many features, prioritize shorter, more specific ones
  if (features.length > 5) {
    return features
      .sort((a, b) => a.length - b.length)
      .slice(0, 5);
  }
  
  // If we don't have enough features, try to extract from longer sentences
  if (features.length < 3) {
    const additionalFeatures: string[] = [];
    
    sentences.forEach(sentence => {
      if (features.length + additionalFeatures.length >= 5) return;
      
      // Look for sentences with numbers or specific details
      if (sentence.match(/\d+/) && sentence.length < 200 && sentence.length > 20) {
        let cleanSentence = sentence
          .replace(/^[,-\s]+/, '')
          .replace(/[,-\s]+$/, '')
          .trim();
        
        if (cleanSentence.length > 0 && !features.includes(cleanSentence)) {
          cleanSentence = cleanSentence.charAt(0).toUpperCase() + cleanSentence.slice(1);
          additionalFeatures.push(cleanSentence);
        }
      }
    });
    
    return [...features, ...additionalFeatures].slice(0, 5);
  }
  
  return features.slice(0, 5);
};
