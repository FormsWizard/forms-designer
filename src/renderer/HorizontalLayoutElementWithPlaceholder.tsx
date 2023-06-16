import type { JsonFormsState, OwnPropsOfRenderer, Scopable, UISchemaElement } from '@jsonforms/core'
import { rankWith, scopeEndsWith } from '@jsonforms/core'
import { useDrop } from 'react-dnd'

import { Box, Grid } from '@mui/material'
import React, {
  useRef,
  ComponentType,
  FC,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { JsonFormsDispatch, withJsonFormsControlProps } from '@jsonforms/react'
import useDropOverWizard from './useDropOverWizard'
import DropTargetFormsPreview from '../features/dragAndDrop/DropTargetFormsPreview'
import {useDragTarget, useDropTarget} from "../app/hooks";
type EmptyLayoutElementProps = {
  child: UISchemaElement | undefined
  childPath: string
  path: string
  elements: UISchemaElement[]
  layoutRendererProps: OwnPropsOfRenderer
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
const StyledPlaceholderElementBox = ({ dropRef, children }) => {

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
      {children}
    </Box>
  )
}

function HorizontalLayoutElementWithPlaceholder({child, childPath, path, elements, layoutRendererProps }: EmptyLayoutElementProps) {
  const { handleAllDrop, draggedMeta } = useDropTarget({ child, childPath })
  const [{ isOver, isOverCurrent }, dropRef] = useDrop(handleAllDrop, [handleAllDrop])
  const { schema, enabled, renderers, cells } = layoutRendererProps
  return (
    <Box>
      <Grid container direction={'row'} sx={{ minWidth: 100, minHeight: 100 }}>
        {[0, 1].map((index) =>
          elements && !!elements[index] ? (
            <Grid item xs>
              <JsonFormsDispatch
                uischema={elements[index]}
                schema={schema}
                path={path}
                enabled={enabled}
                renderers={renderers}
                cells={cells}
              />
            </Grid>
          ) : (
            <Grid item xs>
              <StyledPlaceholderElementBox dropRef={undefined}>
                {isOver && isOverCurrent && draggedMeta ? (
                  <DropTargetFormsPreview metadata={draggedMeta} />
                ) : (
                  'placeholder'
                )}
              </StyledPlaceholderElementBox>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  )
}
export default HorizontalLayoutElementWithPlaceholder

// export default withJsonFormsControlProps(EmptyHorizontalLayoutElement)

// export const emptyHorizontalLayoutTester = rankWith(1, scopeEndsWith('EmptyHorizontalLayout'))
