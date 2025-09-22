
/// <reference types="vite/client" />

// Add Google Maps types for TypeScript
interface Window {
  google: typeof google;
}

declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
    setCenter(latLng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
    getCenter(): LatLng;
    getZoom(): number;
    fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
    getBoundingClientRect(): DOMRect;
    getProjection(): Projection;
    addListener(eventName: string, handler: Function): MapsEventListener;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class LatLngBounds {
    constructor();
    extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
  }

  class Marker {
    constructor(opts: MarkerOptions);
    setMap(map: Map | null): void;
    getPosition(): LatLng;
    addListener(eventName: string, handler: Function): MapsEventListener;
    setAnimation(animation: any): void;
  }

  class Projection {
    fromLatLngToPoint(latLng: LatLng): Point;
  }

  class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
    zoomControl?: boolean;
  }

  interface MarkerOptions {
    position: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    animation?: any;
    icon?: Icon | string | Symbol;
  }

  interface Icon {
    url?: string;
    scaledSize?: Size;
  }

  interface Size {
    width: number;
    height: number;
  }

  interface Symbol {
    path: SymbolPath | string;
    scale?: number;
    fillColor?: string;
    fillOpacity?: number;
    strokeWeight?: number;
    strokeColor?: string;
  }

  enum SymbolPath {
    CIRCLE,
    FORWARD_CLOSED_ARROW,
    FORWARD_OPEN_ARROW,
    BACKWARD_CLOSED_ARROW,
    BACKWARD_OPEN_ARROW
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface LatLngBoundsLiteral {
    east: number;
    north: number;
    south: number;
    west: number;
  }

  interface MapsEventListener {
    remove(): void;
  }
}

declare namespace google {
  namespace maps {
    const event: {
      removeListener(listener: MapsEventListener): void;
    };
    const Animation: {
      DROP: any;
    };
  }
}
