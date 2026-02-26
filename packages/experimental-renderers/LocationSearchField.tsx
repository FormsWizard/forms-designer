import debounce from 'lodash-es/debounce'
import throttle from 'lodash-es/throttle'
import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'

import { geocode, LatLng, NominatimResponse } from './nominatim'
import { Autocomplete, AutocompleteProps, ListItem, ListItemIcon, ListItemText, TextField } from '@mui/material'

export type AutocompleteSuggestion = {
  label: string
  value: string
}

export interface OwnProps {
  onLocationFound?: (lat: number, lng: number, result: NominatimResponse) => void
  initialLocation?: LatLng | null
  hasErrors?: boolean
  addressdetails?: boolean
}

type LocationSearchFieldProps = OwnProps & Partial<AutocompleteProps<NominatimResponse, false, false, false, any>>

const queryGeocode = (searchString: string, setOptions: (r: NominatimResponse[]) => void, addressdetails?: boolean) => {
  if (searchString.length < 2) return
  geocode({
    countrycodes: ['de', 'at', 'ch'],
    ...(addressdetails ? { addressdetails: Boolean(addressdetails) } : {}),
    q: searchString,
  })
    .then((results) => results.length && setOptions(results))
    .catch((error: Error) => console.error(error))
}

const renderOptions = (props: React.HTMLAttributes<HTMLLIElement> & { key?: string }, result: NominatimResponse) => {
  const { display_name, address, icon, place_id } = result
  const { key: _, ...otherProps } = props
  return (
    <ListItem key={place_id} style={{ border: 'none' }} {...otherProps}>
      {icon && (
        <ListItemIcon>
          <img src={icon} />
        </ListItemIcon>
      )}
      <ListItemText>{display_name}</ListItemText>
    </ListItem>
  )
}

type SearchResultData = {
  result: NominatimResponse | null
}

export const LocationSearchField = ({
  onLocationFound,
  initialLocation,
  hasErrors,
  addressdetails,
  ...autocompleteProps
}: LocationSearchFieldProps) => {
  const [options, setOptions] = useState<Array<NominatimResponse>>([])
  const [searchString, setSearchString] = useState<string>('')
  const [selectedEntry, setSelectedEntry] = useState<NominatimResponse | undefined>()
  const handleChange = (e: any) => {
    const value = e.currentTarget.value
    setSearchString(value || '')
  }

  const handleSelect = useCallback(
    (_, value: NominatimResponse | null) => {
      if (value) {
        const { lat, lon } = value
        onLocationFound && onLocationFound(parseFloat(lat), parseFloat(lon), value)
        setSearchString(value.display_name)
        setSelectedEntry(value)
      } else {
        setSelectedEntry(undefined)
      }
    },
    [onLocationFound, setSearchString, setSelectedEntry]
  )

  const throttleGeocode = useCallback(
    throttle((_searchString) => queryGeocode(_searchString, setOptions, addressdetails), 1000),
    [queryGeocode, setOptions, addressdetails]
  )
  const debouncedGeocode = useCallback(
    debounce((_searchString) => queryGeocode(_searchString, setOptions, addressdetails), 1500),
    [queryGeocode, setOptions, addressdetails]
  )

  useEffect(() => {
    if (searchString.length < 5) throttleGeocode(searchString)
    else debouncedGeocode(searchString)
  }, [searchString, setOptions])

  // Ensure the selected entry is always in the options array
  const allOptions = React.useMemo(() => {
    if (selectedEntry && !options.find(option => option.place_id === selectedEntry.place_id)) {
      return [selectedEntry, ...options]
    }
    return options
  }, [options, selectedEntry])

  return (
    <Autocomplete
      disablePortal
      getOptionLabel={(option) => option.display_name}
      options={allOptions || []}
      fullWidth={true}
      value={selectedEntry || null}
      onInputChange={handleChange}
      onChange={handleSelect}
      renderOption={renderOptions}
      renderInput={(params) => <TextField {...params} label="Address..." />}
      isOptionEqualToValue={(option, value) => option.place_id === value.place_id}
      {...autocompleteProps}
    />
  )
}
