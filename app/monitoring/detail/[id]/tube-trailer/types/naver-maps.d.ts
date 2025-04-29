declare namespace naver.maps {
  interface Map {
    setMapTypeId(mapTypeId: MapTypeId): void;
    setCenter(latlng: LatLng): void;
    setZoom(level: number, useEffect?: boolean): void;
    panTo(latlng: LatLng, options?: any): void;
    panToBounds(bounds: any, options?: any): void;
    setOptions(key: string | MapOptions, value?: any): void;
  }

  interface LatLng {
    equals(latlng: LatLng): boolean;
    clone(): LatLng;
    toPoint(): Point;
    lat(): number;
    lng(): number;
    toString(): string;
  }

  interface Marker {
    setMap(map: Map | null): void;
    setPosition(position: LatLng): void;
    setVisible(visible: boolean): void;
    getVisible(): boolean;
    getPosition(): LatLng;
  }

  interface MapOptions {
    background?: string;
    baseTileOpacity?: number;
    bounds?: any;
    center: LatLng;
    disableDoubleClickZoom?: boolean;
    disableDoubleTapZoom?: boolean;
    disableKineticPan?: boolean;
    disableTwoFingerTapZoom?: boolean;
    draggable?: boolean;
    keyboardShortcuts?: boolean;
    logoControl?: boolean;
    logoControlOptions?: any;
    mapDataControl?: boolean;
    mapDataControlOptions?: any;
    mapTypeControl?: boolean;
    mapTypeControlOptions?: any;
    mapTypeId?: MapTypeId;
    maxBounds?: any;
    maxZoom?: number;
    minZoom?: number;
    padding?: any;
    pinchZoom?: boolean;
    resizeOrigin?: any;
    scaleControl?: boolean;
    scaleControlOptions?: any;
    scrollWheel?: boolean;
    size?: Size;
    tileSpare?: number;
    tileTransition?: boolean;
    zoom?: number;
    zoomControl?: boolean;
    zoomControlOptions?: any;
    zoomOrigin?: Point;
  }

  interface MarkerOptions {
    animation?: Animation;
    clickable?: boolean;
    cursor?: string;
    draggable?: boolean;
    flat?: boolean;
    icon?: string | ImageIcon;
    map?: Map;
    opacity?: number;
    position: LatLng;
    shape?: any;
    title?: string;
    visible?: boolean;
    zIndex?: number;
  }

  interface ImageIcon {
    url: string;
    size?: Size;
    scaledSize?: Size;
    origin?: Point;
    anchor?: Point;
  }

  enum Animation {
    BOUNCE = 1,
    DROP = 2,
  }

  enum MapTypeId {
    NORMAL = 'normal',
    TERRAIN = 'terrain',
    SATELLITE = 'satellite',
    HYBRID = 'hybrid',
  }

  class Size {
    constructor(width: number, height: number);
    width: number;
    height: number;
    equals(size: Size): boolean;
    toString(): string;
  }

  class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
    equals(point: Point): boolean;
    toString(): string;
  }

  interface Event {
    addListener(element: any, eventName: string, handler: Function): any;
    removeListener(listener: any): void;
  }
}

declare global {
  interface Window {
    naver: {
      maps: typeof naver.maps;
    };
  }
}
