import type {OwnPropsOfRenderer, UISchemaElement} from '@jsonforms/core'
import {useDrop} from 'react-dnd'

import {Box, Grid} from '@mui/material'
import React from 'react'
import {JsonFormsDispatch} from '@jsonforms/react'
import DropTargetFormsPreview from '../features/dragAndDrop/DropTargetFormsPreview'
import {useDropTarget} from "../app/hooks";

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
const StyledPlaceholderElementBox = ({draggedMeta, handleAllDrop}: StyledPlaceholderProps) => {
  // @ts-ignore
  const [{isOver, isOverCurrent}, dropRef] = useDrop(handleAllDrop, [handleAllDrop])
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
        {isOver && isOverCurrent && draggedMeta ? (
            <DropTargetFormsPreview metadata={draggedMeta}/>
        ) : (
            'placeholder'
        )}
      </Box>
  )
}

function LayoutPlaceholder({
                                                  child,
                                                  path,
                                                  elements,
                                                  layoutRendererProps,
                                                  direction = 'row'
                                                }: EmptyLayoutElementProps) {
  //TODO make sure we have child.path
  const {handleAllDrop, draggedMeta} = useDropTarget(
      {child, uiSchemaPath: `${(child as any).path}.elements.0`})
  const {schema, enabled, renderers, cells} = layoutRendererProps
  return (
      <Box>
        <Grid container direction={direction} sx={{minWidth: 100, minHeight: 100}}>
          {[0, 1].map((index) => <Grid key={index} item xs>{
                elements && !!elements[index] ? (
                    <JsonFormsDispatch
                        uischema={elements[index]}
                        schema={schema}
                        path={path}
                        enabled={enabled}
                        renderers={renderers}
                        cells={cells}
                    />
                ) : (
                    <StyledPlaceholderElementBox draggedMeta={draggedMeta} handleAllDrop={handleAllDrop}/>
                )
              }
          </Grid>)}
        </Grid>
      </Box>
  )
}

export default LayoutPlaceholder
