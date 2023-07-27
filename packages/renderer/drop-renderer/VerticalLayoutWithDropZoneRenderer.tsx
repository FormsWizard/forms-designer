import {
  LayoutProps,
  OwnPropsOfLayout,
  RankedTester,
  rankWith,
  UISchemaElement,
  uiTypeIs,
  VerticalLayout
} from '@jsonforms/core'
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
    uischema: uischema as UISchemaElement,
  }

  return <LayoutWithDropZoneRenderer {...childProps} renderers={renderers} cells={cells} />
}

const VerticalLayoutWithDropZoneRendererWithProps: React.ComponentClass<LayoutProps & OwnPropsOfLayout> | React.FunctionComponent<LayoutProps & OwnPropsOfLayout> = withJsonFormsLayoutProps(VerticalLayoutWithDropZoneRenderer);
export default VerticalLayoutWithDropZoneRendererWithProps
export const verticalLayoutTester: RankedTester = rankWith(10, uiTypeIs('VerticalLayout'))
