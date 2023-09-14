import React from 'react'
import { and, ControlProps, formatIs, isStringControl, RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import dynamic from 'next/dynamic'
import { WktLiteralInputControl, LocationSearchMapProps } from '@formswizard/experimental-renderers'

export const LocationSearchTextFieldRenderer = (props: ControlProps) => {
  const LocationSearchMap = dynamic(
    () => import('@formswizard/experimental-renderers').then((mod) => mod.LocationSearchMap),
    { ssr: false }
  )
  return (
    <WktLiteralInputControl
      mapElement={(props_: LocationSearchMapProps) => <LocationSearchMap {...props_} />}
      {...props}
    />
  )
}

export const WktLiteralTextControlTester: RankedTester = rankWith(10, and(isStringControl, formatIs('wktLiteral')))
export const LocationSearchTextControlRenderer = withJsonFormsControlProps(LocationSearchTextFieldRenderer)
