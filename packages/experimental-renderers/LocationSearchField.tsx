import {debounce, throttle} from 'lodash'
import * as React from 'react'
import {useCallback, useEffect, useState} from 'react'

import {geocode, LatLng, latLngToString, NominatimResponse} from './nominatim'
import {Autocomplete, TextField} from "@mui/material";

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
/*
const renderResult = (result: SearchResultProps) => {
  const {display_name, address, icon, place_id} = result as unknown as NominatimResponse
  return <Label as={'a'} size={'huge'} basic key={place_id} style={{border: 'none'}} >
    {icon && <img src={icon} />}
      {display_name}
  </Label>
}*/

type SearchResultData = {
  result: NominatimResponse | null
}

export const LocationSearchField = ({onLocationFound, initialLocation, hasErrors}: LocationSearchFieldProps) => {
  const [options, setOptions] = useState<Array<NominatimResponse>>([])
  const [searchString, setSearchString] = useState<string>('')
  const [placeholder, setPlaceholder] = useState(initialLocation ? latLngToString(initialLocation) : '')

  const handleChange = (e: any) => {
    const value = e.currentTarget.value
    setSearchString(value || '');
  }

  const handleSelect = (_, data) => {
    const value: NominatimResponse | null = data.result as NominatimResponse | null
    if (value) {
      const {lat, lon} = value
      onLocationFound && onLocationFound(parseFloat(lat), parseFloat(lon), value)
      setPlaceholder(`${lat},${lon}`)
    setSearchString(value.display_name)
  }
  }

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

  return (
      <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={options || []}
          sx={{ width: 300 }}
          onInputChange={handleChange}
          onChange={handleSelect}
          renderInput={(params) => <TextField {...params} label="Address..." />}
      />)
  /*
    <Search
      icon={'world'}
      size='huge'
      fluid
      className={'autoComplete'}
      text={'Addresse suchen'}
      id="search-place"
      value={searchString}
      input={{
        error: hasErrors,
        placeholder: placeholder || (initialLocation ? latLngToString(initialLocation) : '')
      }}
      onSearchChange={handleChange}
      resultRenderer={renderResult}
      onResultSelect={handleSelect}
      results={options || []}
    />*/



}
