import {NominatimResponse} from "./nominatim";

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export type LatLngTuple = [number, number];

export type LatLngExpression =  LatLngLiteral | LatLngTuple;
export interface LocationSearchMapProps {
  markerPosition?: LatLngExpression
  onChangeMarkerPosition?: (lat: number, lng: number, result?: NominatimResponse) => void
  readonly?: boolean
  label?: string
}
