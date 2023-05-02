import type { JsonFormsState, Scopable, UISchemaElement } from '@jsonforms/core'
import { rankWith, scopeEndsWith } from '@jsonforms/core'

import { Box, Grid } from '@mui/material'
import React, {
  ComponentType,
  FC,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { withJsonFormsControlProps } from '@jsonforms/react'
import useDropOverWizard from './useDropOverWizard'
import DropTargetFormsPreview from '../features/dragAndDrop/DropTargetFormsPreview'
type EmptyLayoutElementProps = {
  path: string
}

// const StyledPlaceholderElementBox = styled(Box)(({ theme }) => ({
//   border: `1px dashed blue`,
//   borderRadius: '5px',
//   boxSizing: 'border-box',
//   padding: '2em',
//   margin: '1em',

//   '&:hover': {
//     border: `1px dashed green`,
//   },
// }))
const StyledPlaceholderElementBox = ({ children }) => {
  return (
    <Box
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
      {children}
    </Box>
  )
}

function EmptyHorizontalLayoutElement({ path }: EmptyLayoutElementProps) {
  const { draggedMeta, isOver, isOverCurrent } = useDropOverWizard({ path })
  return (
    <Box>
      <Grid container direction={'row'} sx={{ minWidth: 100, minHeight: 100 }}>
        <Grid item xs>
          <StyledPlaceholderElementBox>
            {isOver && isOverCurrent && draggedMeta ? <DropTargetFormsPreview metadata={draggedMeta} /> : 'placeholder'}
          </StyledPlaceholderElementBox>
        </Grid>
        <Grid item xs>
          <StyledPlaceholderElementBox>
            {isOver && isOverCurrent && draggedMeta ? <DropTargetFormsPreview metadata={draggedMeta} /> : 'placeholder'}
          </StyledPlaceholderElementBox>
        </Grid>
      </Grid>
    </Box>
  )
}
export default EmptyHorizontalLayoutElement

// export default withJsonFormsControlProps(EmptyHorizontalLayoutElement)

// export const emptyHorizontalLayoutTester = rankWith(1, scopeEndsWith('EmptyHorizontalLayout'))
