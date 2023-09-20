import React from 'react'
import { and, ControlProps, formatIs, isStringControl, RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { LocationSearchMap } from './LocationSearchMap'
import { LocationSearchMapProps } from './types'
import { WktLiteralInputControl } from './WktLiteralInputControl'

export const LocationSearchTextFieldRenderer = (props: ControlProps) => {
  return (
    <WktLiteralInputControl
      mapElement={(props_: LocationSearchMapProps) => <LocationSearchMap {...props_} />}
      {...props}
    />
  )
}

export const WktLiteralTextControlTester: RankedTester = rankWith(10, and(isStringControl, formatIs('wktLiteral')))
export const LocationSearchTextControlRenderer = withJsonFormsControlProps(LocationSearchTextFieldRenderer)
