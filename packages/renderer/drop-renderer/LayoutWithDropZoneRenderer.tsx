import type { UISchemaElement } from '@jsonforms/core'
import { OwnPropsOfRenderer } from '@jsonforms/core'
import { Box, Grid } from '@mui/material'

import React, { memo } from 'react'

import LayoutElement from './LayoutElement'
import LayoutPlaceholder from './LayoutPlaceholder'

export interface MaterialLayoutRendererProps extends OwnPropsOfRenderer {
  elements: UISchemaElement[]
  direction: 'row' | 'column'
  uischema: UISchemaElement
}

const HorizontalArrow = ({ size = 10 }: { size?: number }) => {
  const top = -(size - 1),
    double = size * 2
  return (
    <Box
      sx={(theme) => {
        const color = theme.palette.mode === 'light' ? theme.palette.grey.A100 : theme.palette.grey[700]
        return {
          position: 'relative',
          width: '100%',
          height: '1px',
          backgroundColor: color,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: `${top}px`,
            left: '-1px',
            borderTop: `${size}px solid transparent`,
            borderBottom: `${size}px solid transparent`,
            borderRight: `${double}px solid ${color}`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: `${top}px`,
            right: '-1px',
            borderTop: `${size}px solid transparent`,
            borderBottom: `${size}px solid transparent`,
            borderLeft: `${double}px solid ${color}`,
          },
        }
      }}
    ></Box>
  )
}

const VerticalArrow = ({ size = 10 }: { size?: number }) => {
  const left = -(size - 1),
    double = size * 2
  return (
    <Box
      sx={(theme) => {
        const color = theme.palette.mode === 'light' ? theme.palette.grey.A100 : theme.palette.grey[700]
        return {
          position: 'relative',
          width: '1px',
          height: '100%',
          backgroundColor: color,
          '&::before': {
            content: '""',
            position: 'absolute',
            left: `${left}px`,
            top: '-1px',
            borderLeft: `${size}px solid transparent`,
            borderRight: `${size}px solid transparent`,
            borderBottom: `${double}px solid ${color}`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            left: `${left}px`,
            bottom: '-1px',
            borderLeft: `${size}px solid transparent`,
            borderRight: `${size}px solid transparent`,
            borderTop: `${double}px solid ${color}`,
          },
        }
      }}
    ></Box>
  )
}

const MaterialLayoutRendererComponent = (props: MaterialLayoutRendererProps) => {
  const { visible, elements, schema, path, enabled, direction, renderers, cells, uischema } = props
  const size = 6
  return (
    <Box sx={{ display: visible !== false ? 'block' : 'none' }}>
      <Grid container direction={direction === 'row' ? 'column' : 'row'} alignItems={'stretch'}>
        <Grid item flex={0}>
          <div
            style={{
              height: direction === 'row' ? `${size}px` : '100%',
              width: direction === 'row' ? '100%' : `${size}px`,
            }}
          >
            {direction === 'row' ? <HorizontalArrow size={size} /> : <VerticalArrow size={size} />}
          </div>
        </Grid>
        <Grid item flex={1}>
          <Grid
            container
            direction={direction}
            spacing={0}
            sx={{
              alignItems: 'stretch',
              '&:hover': {
                outline: (theme) => `1px dashed ${theme.palette.primary.main}`,
              },
            }}
          >
            {elements.length === 0 ? (
              <LayoutPlaceholder
                direction={direction}
                child={uischema}
                path={path || ''}
                elements={elements}
                layoutRendererProps={props}
              />
            ) : (
              elements.map((element, index) => (
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
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
export const LayoutWithDropZoneRenderer = memo(MaterialLayoutRendererComponent)
