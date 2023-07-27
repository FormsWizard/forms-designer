import {
  HorizontalLayout,
  LayoutProps,
  OwnPropsOfLayout,
  RankedTester,
  rankWith,
  UISchemaElement,
  uiTypeIs
} from '@jsonforms/core'
import { withJsonFormsLayoutProps } from '@jsonforms/react'
import React from 'react'

import { LayoutWithDropZoneRenderer, MaterialLayoutRendererProps } from './LayoutWithDropZoneRenderer'

export const HorizontalLayoutWithDropZoneRenderer = (props: LayoutProps) => {
  const { uischema, schema, path, enabled, visible, renderers, cells } = props
  const horizontalLayout = uischema as HorizontalLayout
  const childProps: MaterialLayoutRendererProps = {
    elements: horizontalLayout.elements,
    schema,
    path,
    enabled,
    direction: 'row',
    visible,
    uischema: uischema as UISchemaElement,
  }

  return <LayoutWithDropZoneRenderer {...childProps} renderers={renderers} cells={cells} />
}

const HorizontalLayoutWithDropZoneRendererWithProps: React.ComponentClass<LayoutProps & OwnPropsOfLayout> | React.FunctionComponent<LayoutProps & OwnPropsOfLayout> = withJsonFormsLayoutProps(HorizontalLayoutWithDropZoneRenderer);
export default HorizontalLayoutWithDropZoneRendererWithProps
export const horizontalLayoutTester: RankedTester = rankWith(10, uiTypeIs('HorizontalLayout'))
