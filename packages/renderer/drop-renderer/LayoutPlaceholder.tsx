import type { OwnPropsOfRenderer, UISchemaElement } from '@jsonforms/core'

import { Box, Grid } from '@mui/material'
import React from 'react'
import { DropTargetFormsPreview } from './DropTargetFormsPreview'
import { useDNDHooksContext, useDropTarget } from '@formswizard/react-hooks'
import { ArrowForward } from '@mui/icons-material'

type EmptyLayoutElementProps = {
  child: UISchemaElement
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
  const { useDrop } = useDNDHooksContext()
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
        minWidth: 200,
        minHeight: 100,
        margin: '1em',
        display: 'flex',
        // '&:hover': {
        //   border: `1px dashed green`,
        // },
        backgroundColor: (theme) => (isOver ? theme.palette.action.focus : 'transparent'),
      }}
    >
      {isOver && isOverCurrent && draggedMeta ? (
        <DropTargetFormsPreview metadata={draggedMeta} />
      ) : (
        <span style={{ margin: 'auto' }}> Placeholder</span>
      )}
    </Box>
  )
}

function LayoutPlaceholder({ child, path, elements, layoutRendererProps, direction = 'row' }: EmptyLayoutElementProps) {
  //TODO make sure we have child.path
  const { handleDropAtStart, draggedMeta } = useDropTarget({ child, isPlaceholder: true })
  const { schema, enabled, renderers, cells } = layoutRendererProps
  return (
    <Box>
      {direction === 'row' && <ArrowForward></ArrowForward>}
      <StyledPlaceholderElementBox draggedMeta={draggedMeta} handleAllDrop={handleDropAtStart} />
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
