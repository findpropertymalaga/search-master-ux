import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPropertyCoordinates } from '@/utils/areaCoordinates';

interface PropertyMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
  propertyTitle?: string;
  area?: string;
}

const PropertyMapModal = ({ isOpen, onClose, location, propertyTitle, area }: PropertyMapModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get coordinates based on area, with fallback to location search
  const coordinates = area ? getPropertyCoordinates(area) : null;
  
  let mapUrl: string;
  if (coordinates) {
    mapUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&output=embed&z=15`;
  } else {
    const encodedLocation = encodeURIComponent(location);
    mapUrl = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "p-0 gap-0 overflow-hidden [&>button]:hidden", // Hide the default close button
          isFullscreen 
            ? "max-w-[98vw] max-h-[98vh] w-[98vw] h-[98vh]" 
            : "max-w-5xl max-h-[85vh] w-full h-[700px]"
        )}
      >
        {/* Map content with overlay controls */}
        <div className="relative w-full h-full bg-gray-100">
          <iframe
            src={mapUrl}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            title={`Map showing ${location}`}
          />
          
          {/* Top overlay with disclaimer and controls */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            {/* Disclaimer at top center */}
            <div className="flex-1 flex justify-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                <p className="text-xs text-gray-600">📍 Location is approximate</p>
              </div>
            </div>
            
            {/* Controls on the right */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="bg-white/95 backdrop-blur-sm hover:bg-white rounded-lg p-2 shadow-sm transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4 text-gray-700" />
                ) : (
                  <Maximize2 className="h-4 w-4 text-gray-700" />
                )}
              </button>
              
              <button
                onClick={onClose}
                className="bg-white/95 backdrop-blur-sm hover:bg-white rounded-lg p-2 shadow-sm transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyMapModal;