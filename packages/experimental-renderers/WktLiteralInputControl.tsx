import React, { useCallback, useMemo, useState } from 'react'
import { ControlProps } from '@jsonforms/core'
import { pathToPathSegments, pathSegmentsToPath, splitLastPath, filterNullOrUndef, scopeToPathSegments } from '@formswizard/utils'
import { NominatimResponse, NominatimReverseResult, reverse } from './nominatim'
import { LocationSearchCombined } from './LocationSearchCombined'
import { wktToLatLng } from './wktToLantLng'
import { LocationSearchMapProps } from './types'
import { NominatimDetailsDialog } from './NominatimDetailsDialog'

type WktLiteralInputControlProps = ControlProps & {
  mapElement?: (props: LocationSearchMapProps) => React.ReactNode
}
// @ts-ignore
const buildPath = (scope: string) =>
  pathSegmentsToPath(scopeToPathSegments(scope))

export const WktLiteralInputControl = (props: WktLiteralInputControlProps) => {
  const { uischema, handleChange, path, data, mapElement } = props

  const position = useMemo(() => {
    if (data) {
      const parsed = wktToLatLng(data)
      if (parsed) return parsed
    }
  }, [data]) || { lat: 51.0833, lng: 13.73126 }

  const { mapNominatimFields, nominatimFieldMappings, showConfirmationDialog } = uischema.options || {}

  const [nominatimData, setNominatimData] = useState<NominatimReverseResult | NominatimResponse | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      reverse({ lat, lng }).then((result) => {
        if (showConfirmationDialog) {
          setNominatimData(result)
          setConfirmDialogOpen(true)
        } else {
          handleMapNominatimFieldsChange(result)
        }
        //handleLocationFound(lat, lng, result)
      })
    },
    [setNominatimData, setConfirmDialogOpen]
  )


  const handleMapNominatimFieldsChange = useCallback((result: NominatimReverseResult | NominatimResponse) => {
    if (mapNominatimFields) {
      if (nominatimFieldMappings) {
        for (const [key, value] of Object.entries(nominatimFieldMappings as Record<string, string>)) {
          if (value === 'none') continue
          const path = buildPath(value)
          if (key === 'name' && (result as NominatimResponse).name) {
            handleChange(path, (result as NominatimResponse).name)
            continue
          }
          if (key === 'display_name' && result.display_name) {
            handleChange(path, result.display_name)
            continue
          }
          if (typeof result.address?.[key] === 'string') {
            handleChange(path, result.address[key])
          }
        }
      }
    }
  }, [nominatimFieldMappings, mapNominatimFields, handleChange])

  const handleConfirmDialogClose = useCallback(() => {
    setConfirmDialogOpen(false)
    setNominatimData(null)
  }, [setConfirmDialogOpen])

  const handleConfirmDialogAccept = useCallback((data: NominatimReverseResult) => {
    setConfirmDialogOpen(false)
    handleMapNominatimFieldsChange(data)
  }, [handleMapNominatimFieldsChange, setConfirmDialogOpen])

  const handleLocationFound = useCallback(
    (lat: number, lng: number, result?: NominatimResponse) => {

      if (!result) {
        reverseGeocode(lat, lng)
      }
      handleChange(props.path, `POINT(${lng} ${lat})`)
      if (!result) return
      if (showConfirmationDialog) {
        setNominatimData(result)
        setConfirmDialogOpen(true)
      } else {
        handleMapNominatimFieldsChange(result)
      }
    },
    [path, handleChange, handleMapNominatimFieldsChange, showConfirmationDialog, setNominatimData, setConfirmDialogOpen]
  )
  return (<>
    {showConfirmationDialog && <NominatimDetailsDialog
      open={confirmDialogOpen}
      onClose={handleConfirmDialogClose}
      onAccept={handleConfirmDialogAccept}
      onCancel={handleConfirmDialogClose}
      data={nominatimData}
      onDataChange={setNominatimData}
    />}
    <LocationSearchCombined
      readonly={props.enabled === false}
      label={data || props.label}
      markerPosition={position}
      onChangeMarkerPosition={handleLocationFound}
      mapElement={mapElement}
      addressdetails={mapNominatimFields}
    />
  </>)
}
