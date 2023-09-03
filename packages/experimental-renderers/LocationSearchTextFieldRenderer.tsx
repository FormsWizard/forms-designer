import React, {useCallback, useMemo, useState} from 'react';
import {
  and,
  ControlProps, formatIs,
  isStringControl,
  RankedTester,
  rankWith
} from '@jsonforms/core';
import {withJsonFormsControlProps} from '@jsonforms/react';
import {pathToPathSegments, pathSegmentsToPath, splitLastPath, filterNullOrUndef} from "@formswizard/utils";
import {NominatimResponse} from "./nominatim";
import {LocationSearchMap} from "./LocationSearchMap";


/**
 * parses a WKT string into a lat/lng object
 *
 * @param wkt
 * @returns {{lat: number, lng: number}|undefined} undefined if parsing failed
 */
const wktToLatLng = (wkt: string): { lat: number, lng: number } | undefined => {
  const testerRegEx = /^POINT\s*\(([0-9\.]+)\s+([0-9\.]+)\)$/
  const match = wkt.match(testerRegEx)
  if (match) {
    const [, lngS, latS] = match,
        lat = parseFloat(latS),
        lng = parseFloat(lngS)
    if (!isNaN(lat) && !isNaN(lng)) return {lat, lng}
  }
  return undefined
}
export const WktLiteralInputControl = (props: ControlProps) => {
  const {
    uischema,
    handleChange,
    path,
    data
  } = props;

  const position = useMemo(() => {
    if (data) {
      const parsed = wktToLatLng(data);
      if (parsed) return parsed
    }
  }, [data]) || {lat: 51.0833, lng: 13.73126}

  const handleLocationFound = useCallback((lat: number, lng: number, result?: NominatimResponse) => {
    const [first, rest] = splitLastPath(path);
    // @ts-ignore
    const buildPath = (key: string) => pathSegmentsToPath([...filterNullOrUndef<string>(pathToPathSegments(rest || '')).filter(p => p.length > 0), key]);
    handleChange(props.path, `POINT(${lng} ${lat})`);
    if (!result) return
    if (uischema.options?.mapNominatimFields) {
      if ((result as any).name) {
        const path = buildPath('name')
        // @ts-ignore
        handleChange(path, result.name);
      }
    }
  }, [path, handleChange, uischema])
  return (
      <LocationSearchMap
          readonly={props.enabled === false}
          label={data || props.label}
          markerPosition={position}
          onChangeMarkerPosition={handleLocationFound}
      />
  );
};

export const WktLiteralTextControlTester: RankedTester = (rankWith(
    10,
    and(isStringControl, formatIs('wktLiteral'))));
export const WktLiteralTextControlRenderer = withJsonFormsControlProps(WktLiteralInputControl);
