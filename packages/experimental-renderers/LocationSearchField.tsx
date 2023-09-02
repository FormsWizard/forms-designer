import {debounce, throttle} from 'lodash'
import * as React from 'react'
import {useCallback, useEffect, useState} from 'react'

import {geocode, LatLng, latLngToString, NominatimResponse} from './nominatim'
import {Autocomplete, ListItem, ListItemIcon, ListItemText, TextField} from "@mui/material";

export type AutocompleteSuggestion = {
  label: string;
  value: string;
};

export interface LocationSearchFieldProps {
  onLocationFound?: (lat: number, lng: number, result: NominatimResponse) => void
  initialLocation?: LatLng | null
  hasErrors?: boolean
}

const queryGeocode = (searchString: string, setOptions: (r: NominatimResponse[]) => void) => {
  if (searchString.length < 2) return
  geocode({
    countrycodes: ['de', 'at', 'ch'],
    q: searchString
  })
      .then((results) =>
          results.length && setOptions(results)
      )
      .catch((error: Error) => console.error(error))

}

const renderOptions = (props: React.HTMLAttributes<HTMLLIElement>, result: NominatimResponse) => {
  const {display_name, address, icon, place_id} = result
  return <ListItem key={place_id} style={{border: 'none'}} {...props} >
    {icon && <ListItemIcon>
      <img src={icon}/>
    </ListItemIcon>}
    <ListItemText>
      {display_name} test
    </ListItemText>
  </ListItem>
}

type SearchResultData = {
  result: NominatimResponse | null
}

export const LocationSearchField = ({onLocationFound, initialLocation, hasErrors}: LocationSearchFieldProps) => {
  const [options, setOptions] = useState<Array<NominatimResponse>>([])
  const [searchString, setSearchString] = useState<string>('')
  const [selectedEntry, setSelectedEntry] = useState<NominatimResponse | undefined>();
  const handleChange = (e: any) => {
    const value = e.currentTarget.value
    setSearchString(value || '');
  }

  const handleSelect = useCallback((_, value: NominatimResponse | null) => {
    if (value) {
      const {lat, lon} = value
      onLocationFound && onLocationFound(parseFloat(lat), parseFloat(lon), value)
      setSearchString(value.display_name)
      setSelectedEntry(value)
    } else {
      setSelectedEntry(undefined)
    }
  }, [onLocationFound, setSearchString, setSelectedEntry])

  const throttleGeocode = useCallback(
      throttle(_searchString => queryGeocode(_searchString, setOptions), 1000)
      , [queryGeocode, setOptions])
  const debouncedGeocode = useCallback(
      debounce(_searchString => queryGeocode(_searchString, setOptions), 1500)
      , [queryGeocode, setOptions])


  useEffect(() => {
    if (searchString.length < 5)
      throttleGeocode(searchString)
    else
      debouncedGeocode(searchString)
  }, [searchString, setOptions])

  return (<Autocomplete
            disablePortal
            getOptionLabel={(option) => option.display_name}
            options={options || []}
            fullWidth={true}
            value={selectedEntry}
            onInputChange={handleChange}
            onChange={handleSelect}
            renderOption={renderOptions}
            renderInput={(params) => <TextField {...params} label="Address..."/>}
        />
  )

}
