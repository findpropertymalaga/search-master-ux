
interface PropertyDescriptionProps {
  description: string;
  terrace?: number;
  propertyRef?: string;
}

const PropertyDescription = ({ description, terrace, propertyRef }: PropertyDescriptionProps) => {
  // Function to remove the redundant first sentence containing price/bed/bath/size info
  const cleanDescription = (desc: string): string => {
    if (!desc) return desc;
    
    // Pattern to match the standard first sentence with price ranges and property details
    // Matches patterns like: "New Development: Prices from X € to Y €. [Beds: X - Y] [Baths: X - Y] [Built size: X m2 - Y m2]"
    const redundantPatterns = [
      /^New Development:\s*Prices from[\s\S]*?\[Built size:[\s\S]*?\]\s*/i,
      /^Prices from[\s\S]*?\[Built size:[\s\S]*?\]\s*/i,
      /^Development:\s*Prices from[\s\S]*?\[Built size:[\s\S]*?\]\s*/i
    ];
    
    let cleanedDesc = desc;
    
    // Check each pattern and remove if found at the beginning
    for (const pattern of redundantPatterns) {
      if (pattern.test(cleanedDesc)) {
        cleanedDesc = cleanedDesc.replace(pattern, '').trim();
        break;
      }
    }
    
    return cleanedDesc;
  };

  // Function to extract the first phrase from description
  const getFirstPhrase = (desc: string): string => {
    if (!desc) return 'Description';
    
    // Look for the first sentence ending with period, exclamation, or question mark
    const firstSentenceMatch = desc.match(/^[^.!?]*[.!?]/);
    if (firstSentenceMatch) {
      return firstSentenceMatch[0].trim();
    }
    
    // If no sentence ending found, take first 50 characters and add ellipsis
    const firstPart = desc.substring(0, 50).trim();
    return firstPart.length < desc.length ? firstPart + '...' : firstPart;
  };

  // Function to remove the first phrase from description body
  const removeFirstPhrase = (desc: string): string => {
    if (!desc) return desc;
    
    // Look for the first sentence ending with period, exclamation, or question mark
    const firstSentenceMatch = desc.match(/^[^.!?]*[.!?]\s*/);
    if (firstSentenceMatch) {
      return desc.substring(firstSentenceMatch[0].length).trim();
    }
    
    // If no sentence ending found, remove first 50 characters
    const firstPart = desc.substring(0, 50).trim();
    if (firstPart.length < desc.length) {
      return desc.substring(50).trim();
    }
    
    return ''; // If the entire description was used as title, return empty
  };

  const processedDescription = cleanDescription(description);
  const titleText = getFirstPhrase(processedDescription);
  const bodyText = removeFirstPhrase(processedDescription);

  return (
    <div>
      <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">{titleText}</h2>
      
      {/* Full Description */}
      <div className="prose max-w-none">
        <p className="text-gray-600 whitespace-pre-line leading-relaxed">
          {bodyText || 'Description of this property is not available.'}
        </p>
      </div>
    </div>
  );
};

export default PropertyDescription;
