
interface PropertyDetailBadgesProps {
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType?: string;
  plotSize?: number;
}

const PropertyDetailBadges = ({ bedrooms, bathrooms, area, propertyType, plotSize }: PropertyDetailBadgesProps) => {
  const isPlotProperty = propertyType?.toLowerCase().startsWith('plot');
  const displayArea = isPlotProperty && plotSize ? plotSize : area;
  const areaLabel = isPlotProperty ? 'M2 PLOT' : 'M2 BUILT';
  return (
    <div className="flex gap-2 mb-6">
      <div className="flex items-center bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-200">
        <div className="text-center">
          <div className="text-base font-bold text-blue-800">{bedrooms}</div>
          <div className="text-xs text-blue-600 uppercase tracking-wide">BEDS</div>
        </div>
      </div>
      
      <div className="flex items-center bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-200">
        <div className="text-center">
          <div className="text-base font-bold text-blue-800">{bathrooms}</div>
          <div className="text-xs text-blue-600 uppercase tracking-wide">BATHS</div>
        </div>
      </div>
      
      <div className="flex items-center bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-200">
        <div className="text-center">
          <div className="text-base font-bold text-blue-800">{displayArea}</div>
          <div className="text-xs text-blue-600 uppercase tracking-wide">{areaLabel}</div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailBadges;
