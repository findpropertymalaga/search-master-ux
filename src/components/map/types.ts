
import { Property } from "@/components/property/types";

export type { Property };

export interface PropertyMapProps {
  properties: Property[];
  isFullscreen?: boolean;
}

export interface GoogleMapProps {
  children: React.ReactNode;
  fullscreen?: boolean;
  onLoad: (map: google.maps.Map) => void;
  center: {lat: number; lng: number};
}

export interface PropertyMarkersProps {
  properties: Property[];
  map: google.maps.Map | null;
  onSelectProperty: (property: Property) => void;
}

export interface PropertyMapModalProps {
  selectedProperty: Property | null;
  onClose: () => void;
}
