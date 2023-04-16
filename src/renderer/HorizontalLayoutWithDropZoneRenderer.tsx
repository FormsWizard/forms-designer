import { HorizontalLayout, LayoutProps, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core'
import { withJsonFormsLayoutProps } from '@jsonforms/react'
import React from 'react'

import { LayoutWithDropZoneRenderer, MaterialLayoutRendererProps } from './LayoutWithDropZoneRenderer'

export const HorizontalLayoutWithDropZoneRenderer = ({
  uischema,
  schema,
  path,
  enabled,
  visible,
  renderers,
  cells,
}: LayoutProps) => {
  const horizontalLayout = uischema as HorizontalLayout
  const childProps: MaterialLayoutRendererProps = {
    elements: horizontalLayout.elements,
    schema,
    path,
    enabled,
    direction: 'row',
    visible,
  }

  return <LayoutWithDropZoneRenderer {...childProps} renderers={renderers} cells={cells} />
}

export default withJsonFormsLayoutProps(HorizontalLayoutWithDropZoneRenderer)
export const horizontalLayoutTester: RankedTester = rankWith(10, uiTypeIs('HorizontalLayout'))
