import 'leaflet'
import 'leaflet/dist/leaflet.css'

import * as L from 'leaflet'
import { useEffect, useMemo } from 'react'
import { LayersControl, Marker, Popup, TileLayer, MapContainer, useMapEvents } from 'react-leaflet'

import { NominatimResponse } from './nominatim'
import { LocationSearchMapProps } from './types'

type LocationSearchMapContentProps = LocationSearchMapProps & {
  color: string
}

export function LocationSearchMapContent({
  markerPosition,
  onChangeMarkerPosition,
  color,
  readonly,
}: LocationSearchMapContentProps) {
  const map = useMapEvents({
    click(e) {
      if (readonly) return
      onChangeMarkerPosition && onChangeMarkerPosition(e.latlng.lat, e.latlng.lng)
    },
    locationfound(e) {},
  })

  useEffect(() => {
    if (!markerPosition) return
    map.flyTo(markerPosition)
  }, [markerPosition, map])

  const svgIcon = useMemo(
    () =>
      L.divIcon({
        html: `
<svg xmlns="http://www.w3.org/2000/svg" 
  width="40"
  height="40"
  preserveAspectRatio="none"
viewBox="0 -256 1792 1792">
<path d="M768 896q0 106-75 181t-181 75q-106 0-181-75t-75-181q0-106 75-181t181-75q106 0 181 75t75 181zm256 0q0-109-33-179L627-57q-16-33-47.5-52T512-128q-36 0-67.5 19T398-57L33 717Q0 787 0 896q0 212 150 362t362 150q212 0 362-150t150-362z" style="fill:${color}" transform="matrix(1 0 0 -1 364.475 1270.237)"/></svg>
`,
        className: 'svg-icon',
        iconSize: [24, 40],
        iconAnchor: [12, 40],
      }),
    [color]
  )

  return (
    <>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap.default">
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxNativeZoom={18}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Arcgis Satelite">
          <TileLayer
            attribution='&copy; <a href="http://www.esri.com/">Esri</a> i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community '
            url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxNativeZoom={20}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      {
        // @ts-ignore
        markerPosition && (
          <Marker position={markerPosition} icon={svgIcon}>
            <Popup>POI</Popup>
          </Marker>
        )
      }
    </>
  )
}

export const LocationSearchMap = (props: LocationSearchMapProps) => (
  <MapContainer
    style={{
      minHeight: '400px',
      height: '100%',
      width: '100%',
    }}
    center={props.markerPosition || [0, 0]}
    zoom={17}
    maxZoom={24}
  >
    <LocationSearchMapContent {...props} color={'#ff0000'} />
  </MapContainer>
)
