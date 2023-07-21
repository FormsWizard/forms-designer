import type { OwnPropsOfRenderer, UISchemaElement } from '@jsonforms/core'
import { useDrop } from 'react-dnd'

import { Box, Grid } from '@mui/material'
import React from 'react'
import { JsonFormsDispatch } from '@jsonforms/react'
import DropTargetFormsPreview from '../features/dragAndDrop/DropTargetFormsPreview'
import { useDropTarget } from '../app/hooks'
import LayoutElement from './LayoutElement'
import { ArrowForward } from '@mui/icons-material'

type EmptyLayoutElementProps = {
  child: UISchemaElement | undefined
  path: string
  elements: UISchemaElement[]
  layoutRendererProps: OwnPropsOfRenderer
  direction: 'row' | 'column'
}

type StyledPlaceholderProps = {
  draggedMeta: any
  handleAllDrop: any
}
const StyledPlaceholderElementBox = ({ draggedMeta, handleAllDrop }: StyledPlaceholderProps) => {
  // @ts-ignore
  const [{ isOver, isOverCurrent }, dropRef] = useDrop(handleAllDrop, [handleAllDrop])
  return (
    <Box
      ref={dropRef}
      sx={{
        border: `1px dashed gray`,
        borderRadius: '5px',
        boxSizing: 'border-box',
        padding: '1em 2em',
        margin: '1em',
        '&:hover': {
          border: `1px dashed green`,
        },
      }}
    >
      {isOver && isOverCurrent && draggedMeta ? <DropTargetFormsPreview metadata={draggedMeta} /> : 'placeholder'}
    </Box>
  )
}

function LayoutPlaceholder({ child, path, elements, layoutRendererProps, direction = 'row' }: EmptyLayoutElementProps) {
  //TODO make sure we have child.path
  const { handleAllDrop, draggedMeta } = useDropTarget({ child, uiSchemaPath: `${(child as any).path}.elements.0` })
  const { schema, enabled, renderers, cells } = layoutRendererProps
  return (
    <Box>
      {direction === 'row' && <ArrowForward></ArrowForward>}
      <StyledPlaceholderElementBox draggedMeta={draggedMeta} handleAllDrop={handleAllDrop} />
      {/* <Box>
        <ArrowForward></ArrowForward>
      </Box>
      <Grid
        container
        spacing={direction === 'row' ? 2 : 0}
        direction={direction}
        sx={{ minWidth: 100, minHeight: 100 }}
      >
        {[0, 1].map((index) => (
          <Grid key={index} item xs>
            {elements && !!elements[index] ? (
              <LayoutElement
                direction={direction}
                key={(path || '') + index}
                index={index}
                // @ts-ignore
                schema={schema}
                // @ts-ignore
                visible={true}
                // @ts-ignore
                path={path}
                // @ts-ignore
                enabled={enabled}
                element={elements[index]}
                parent={elements}
                cells={cells}
                renderers={renderers}
              />
            ) : (
              <StyledPlaceholderElementBox draggedMeta={draggedMeta} handleAllDrop={handleAllDrop} />
            )}
          </Grid>
        ))}
      </Grid> */}
    </Box>
  )
}

export default LayoutPlaceholder
