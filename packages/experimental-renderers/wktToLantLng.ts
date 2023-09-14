/**
 * parses a WKT string into a lat/lng object
 *
 * @param wkt
 * @returns {{lat: number, lng: number}|undefined} undefined if parsing failed
 */
export const wktToLatLng = (wkt: string): { lat: number; lng: number } | undefined => {
  const testerRegEx = /^POINT\s*\(([0-9\.]+)\s+([0-9\.]+)\)$/
  const match = wkt.match(testerRegEx)
  if (match) {
    const [, lngS, latS] = match,
      lat = parseFloat(latS),
      lng = parseFloat(lngS)
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
  }
  return undefined
}
