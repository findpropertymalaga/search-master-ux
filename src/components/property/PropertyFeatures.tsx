
interface PropertyFeaturesProps {
  features: string[];
}

const PropertyFeatures = ({ features }: PropertyFeaturesProps) => {
  if (!features || features.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">Egenskaper</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {features.map((feature, index) => (
          <li key={index} className="text-gray-600 flex items-center">
            <span className="mr-2">•</span> {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyFeatures;
