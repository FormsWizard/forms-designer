import { LayoutProps, RankedTester, rankWith, uiTypeIs, VerticalLayout } from '@jsonforms/core'
import { withJsonFormsLayoutProps } from '@jsonforms/react'
import React from 'react'

import { LayoutWithDropZoneRenderer, MaterialLayoutRendererProps } from './LayoutWithDropZoneRenderer'

export const VerticalLayoutWithDropZoneRenderer = ({
  uischema,
  schema,
  path,
  enabled,
  visible,
  renderers,
  cells,
}: LayoutProps) => {
  const verticalLayout = uischema as VerticalLayout
  const childProps: MaterialLayoutRendererProps = {
    elements: verticalLayout.elements,
    schema,
    path,
    enabled,
    direction: 'column',
    visible,
  }

  return <LayoutWithDropZoneRenderer {...childProps} renderers={renderers} cells={cells} />
}

export default withJsonFormsLayoutProps(VerticalLayoutWithDropZoneRenderer)
export const verticalLayoutTester: RankedTester = rankWith(2, uiTypeIs('VerticalLayout'))
