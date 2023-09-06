import React, { useCallback, useMemo } from 'react'
import { ControlProps } from '@jsonforms/core'
import { pathToPathSegments, pathSegmentsToPath, splitLastPath, filterNullOrUndef } from '@formswizard/utils'
import { NominatimResponse } from './nominatim'
import { LocationSearchCombined } from './LocationSearchCombined'
import { wktToLatLng } from './wktToLantLng'
import { LocationSearchMapProps } from './types'

type WktLiteralInputControlProps = ControlProps & {
  mapElement?: (props: LocationSearchMapProps) => React.ReactNode
}
export const WktLiteralInputControl = (props: WktLiteralInputControlProps) => {
  const { uischema, handleChange, path, data, mapElement } = props

  const position = useMemo(() => {
    if (data) {
      const parsed = wktToLatLng(data)
      if (parsed) return parsed
    }
  }, [data]) || { lat: 51.0833, lng: 13.73126 }

  const handleLocationFound = useCallback(
    (lat: number, lng: number, result?: NominatimResponse) => {
      const [first, rest] = splitLastPath(path)
      // @ts-ignore
      const buildPath = (key: string) =>
        pathSegmentsToPath([
          ...filterNullOrUndef<string>(pathToPathSegments(rest || '')).filter((p) => p.length > 0),
          key,
        ])
      handleChange(props.path, `POINT(${lng} ${lat})`)
      if (!result) return
      if (uischema.options?.mapNominatimFields) {
        if ((result as any).name) {
          const path = buildPath('name')
          // @ts-ignore
          handleChange(path, result.name)
        }
      }
    },
    [path, handleChange, uischema]
  )
  return (
    <LocationSearchCombined
      readonly={props.enabled === false}
      label={data || props.label}
      markerPosition={position}
      onChangeMarkerPosition={handleLocationFound}
      mapElement={mapElement}
    />
  )
}
