export type LatLng = {
  lat: number;
  lng: number;
}

export const latLngToString: ({lat, lng}: LatLng) => string = ({lat, lng} : LatLng) => `${lat},${lng}`
export interface Viewbox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export type FeatureType = 'settlement' | 'country' | 'city' | 'state';

export interface Request {
  /**
   * Include a breakdown of the address into elements
   */
  addressdetails?: boolean;

  /**
   * If you are making large numbers of requests please include a valid email address or alternatively include
   * your email address as part of the User-Agent string. This information will be kept confidential and only
   * used to contact you in the event of a problem.
   */
  email?: string;

  /**
   * Include additional information in the result if available, e.g. wikipedia link, opening hours.
   */
  extratags?: boolean;

  /**
   * Include a list of alternative names in the results. These may include language variants, references,
   * operator and brand.
   */
  namedetails?: boolean;
}

export interface BaseGeocodeRequest extends Request {
  /**
   * Output geometry of results in geojson format.
   */
  polygon_geojson?: boolean;

  /**
   * Output geometry of results in kml format.
   */
  polygon_kml?: boolean;

  /**
   * Output geometry of results in svg format.
   */
  polygon_svg?: boolean;

  /**
   * Output geometry of results as a WKT.
   */
  polygon_text?: boolean;
}

export interface GeocodeAddress {
  county: string;
  city: string;
  city_district: string;
  construction: string;
  continent: string;
  country: string;
  country_code: string;
  house_number: string;
  neighbourhood: string;
  postcode: string;
  public_building: string;
  state: string;
  suburb: string;
}

export interface GeoSearchOptions {
    acceptLanguage?: string;
    addressdetails?: boolean;
    asPointGeometry?: boolean;
    countrycodes?: string[];
}

export interface GeoReverseOptions {
    acceptLanguage?: string;
    addressdetails?: boolean;
    zoom?: number;
}

export interface GeoReverseResult {
    lat: string;
    lon: string;
    displayName?: string;
    address?: Address;
    boundingbox?: string[];
}

interface Address {
    address29: string;
    house_number: string;
    road: string;
    neighbourhood: string;
    suburb: string;
    city_district: string;
    city: string;
    county: string;
    state_district: string;
    state: string;
    postcode: string;
    country: string;
    country_code: string;
}

export interface NominatimResponse {
  address: GeocodeAddress;
  icon?: string;
  boundingbox: string[];
  class: string;
  display_name: string;
  importance: number;
  lat: string;
  licence: string;
  lon: string;
  osm_id: string;
  osm_type: string;
  place_id: string;
  svg: string;
  type: string;
  extratags: never;
}

export interface NominatimReverseResult {
    place_id: string;
    licence: string;
    osm_type: string;
    osm_id: string;
    lat: string;
    lon: string;
    display_name: string;
    address: Address;
    boundingbox: string[];
}


export interface GeocodeRequest extends BaseGeocodeRequest {
  /**
   * House number and street name.
   */
  street?: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
  postalcode?: string;
  /**
   * Limit search results to the given 2-digit country codes.
   */
  countrycodes?: string[];
  /**
   * The preferred area to find search results
   */
  viewbox?: Viewbox;
  /**
   * The preferred area to find search results
   */
  viewboxlbrt?: Viewbox;

  /**
   * Restrict the results to only items contained with the bounding box. Restricting the results to the bounding
   * box also enables searching by amenity only.
   */
  bounded?: boolean;
  /**
   * If you do not want certain openstreetmap objects to appear in the search result, give a comma separated
   * list of the place_id's you want to skip.
   */
  exclude_place_ids?: string[];
  /**
   * Limit the number of returned results.
   */
  limit?: number;
  /**
   * No explanation yet.
   */
  dedupe?: boolean;
  /**
   * No explanation yet.
   */
  debug?: boolean;
  /**
   * Query string to search for. Can be sent as an alternative to the street, city, county, etc. properties.
   */
  q?: string;
  /**
   * Limit results to certain type, instead of trying to match all possible matches.
   */
  featuretype?: FeatureType;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org'

const buildQueryString = (params: { [key: string]: any}) => Object.keys( params ).map( key => {
    // @ts-ignore
    let valuePart = encodeURIComponent( params[key] )
    // @ts-ignore
    if( Array.isArray( params[key] )) {
      // @ts-ignore
      valuePart =  params[key].join( ',' )
    }
    if( key === 'viewbox' || key === 'viewboxlbrt' ) {
      const { left, right, top, bottom } = params[key] as Viewbox
      valuePart = `${left},${top},${right},${bottom}`
    }
    return `${encodeURIComponent( key )}=${valuePart}`
  } ).join( '&' )

export const geocode = async ( params: GeocodeRequest ) => {
  const path = 'search'
  const queryString = buildQueryString({
    format: 'json',
    ...params
  })
  const response = await fetch( new Request( `${NOMINATIM_URL}/${path}?${queryString}` ))
  const result = await response.json()
  return result as NominatimResponse[]
}

export const reverse = async (point: LatLng, options: GeoReverseOptions = {}) => {
  const path = 'reverse'
  const queryString = buildQueryString({
    format: 'json',
    lat: point.lat,
    lon: point.lng,
    ...options
  })
  const response = await fetch( new Request( `${NOMINATIM_URL}/${path}?${queryString}` ))
  const result = await response.json()
  return result as NominatimReverseResult
}
