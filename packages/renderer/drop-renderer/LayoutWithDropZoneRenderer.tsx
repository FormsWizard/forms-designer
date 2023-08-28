import type { UISchemaElement } from '@jsonforms/core'
import { OwnPropsOfRenderer } from '@jsonforms/core'
import { ArrowForward } from '@mui/icons-material'
import { Box, Grid } from '@mui/material'

import React, {memo} from 'react'

import LayoutElement from './LayoutElement'
import LayoutPlaceholder from './LayoutPlaceholder'

export interface MaterialLayoutRendererProps extends OwnPropsOfRenderer {
  elements: UISchemaElement[]
  direction: 'row' | 'column'
  uischema: UISchemaElement
}

const MaterialLayoutRendererComponent = (props: MaterialLayoutRendererProps) => {
  const { visible, elements, schema, path, enabled, direction, renderers, cells, uischema } = props
  if (elements.length === 0) {
    // @ts-ignore
    return (
      <LayoutPlaceholder
        direction={direction}
        child={uischema}
        path={path || ''}
        elements={elements}
        layoutRendererProps={props}
      />
    )
  } else {
    return (
      <Box sx={{ display: visible !== false ? 'block' : 'none' }}>
        {direction === 'row' && <ArrowForward></ArrowForward>}
        <Grid container direction={direction} spacing={direction === 'row' ? 0 : 0}>
          {elements.map((element, index) => (
            <LayoutElement
              direction={direction}
              key={(path || '') + index}
              index={index}
              // @ts-ignore
              schema={schema}
              // @ts-ignore
              visible={visible}
              // @ts-ignore
              path={path}
              // @ts-ignore
              enabled={enabled}
              element={element}
              parent={elements}
              cells={cells}
              renderers={renderers}
            />
          ))}
        </Grid>
      </Box>
    )
  }
}
export const LayoutWithDropZoneRenderer = memo(MaterialLayoutRendererComponent)
