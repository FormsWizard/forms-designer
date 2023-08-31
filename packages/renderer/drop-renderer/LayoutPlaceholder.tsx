import type { OwnPropsOfRenderer, UISchemaElement } from '@jsonforms/core'

import { Box, Grid } from '@mui/material'
import React from 'react'
import { DropTargetFormsPreview } from './DropTargetFormsPreview'
import { useDNDHooksContext, useDropTarget } from '@formswizard/react-hooks'

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
      <StyledPlaceholderElementBox draggedMeta={draggedMeta} handleAllDrop={handleDropAtStart} />
    </Box>
  )
}

export default LayoutPlaceholder
