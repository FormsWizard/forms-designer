import React, { useCallback, useMemo } from 'react'
import { and, ControlProps, formatIs, isStringControl, RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { pathToPathSegments, pathSegmentsToPath, splitLastPath, filterNullOrUndef } from '@formswizard/utils'
import { NominatimResponse } from './nominatim'
import { LocationSearchCombined } from './LocationSearchCombined'

export const LocationSearchTextFieldRenderer = (props: ControlProps) => {
  return (
    <LocationSearchCombined
      readonly={props.enabled === false}
      label={data || props.label}
      markerPosition={position}
      onChangeMarkerPosition={handleLocationFound}
    />
  )
}

export const WktLiteralTextControlTester: RankedTester = rankWith(10, and(isStringControl, formatIs('wktLiteral')))
export const LocationSearchTextControlRenderer = withJsonFormsControlProps(LocationSearchTextFieldRenderer)
