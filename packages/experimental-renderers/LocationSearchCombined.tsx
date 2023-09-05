import * as React from 'react'
import {useCallback, useMemo, useState} from 'react'

import { LocationSearchField } from './LocationSearchField'
import { InputAdornment, IconButton, TextField, Grid } from '@mui/material'
import * as Icons from '@mui/icons-material'
import { NominatimResponse } from './nominatim'
import { LocationSearchMapProps} from "./types"
import dynamic from "next/dynamic";

export function LocationSearchCombined(props: LocationSearchMapProps) {
  const { markerPosition, onChangeMarkerPosition, readonly, label } = props

  const showMarker = true
  const [showMap, setShowMap] = useState(false)
  const updateLocation = useCallback(
    (lat: number, lng: number, result?: NominatimResponse) => {
      onChangeMarkerPosition && onChangeMarkerPosition(lat, lng, result)
    },
    [onChangeMarkerPosition]
  )

  const LocationSearchMap = useMemo( () => dynamic(() => import('./LocationSearchMap').then((mod) => mod.LocationSearchMap), { ssr: false }) , [])
  return (
    <Grid container direction={'column'}>
      <Grid item>
        <LocationSearchField
          readOnly={readonly}
          onLocationFound={updateLocation}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label || 'Address'}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment || null}
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle map visibility" onClick={() => setShowMap(!showMap)} edge="end">
                        {showMap ? <Icons.MapRounded /> : <Icons.MapSharp />}
                      </IconButton>
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}
        />
      </Grid>
      {showMap && (
        <Grid item>
            <LocationSearchMap {...props} />
        </Grid>
      )}
    </Grid>
  )
}
