import type { JsonFormsState, UISchemaElement } from '@jsonforms/core'
import {
  composeWithUi,
  ControlElement,
  getAjv,
  getSchema,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  OwnPropsOfRenderer,
  Resolve,
} from '@jsonforms/core'
import { JsonFormsDispatch, useJsonForms } from '@jsonforms/react'
import { Box, Grid, IconButton, Paper } from '@mui/material'
import Ajv from 'ajv'
import isEmpty from 'lodash/isEmpty'
import React, { ComponentType, FC, MouseEventHandler, ReactNode, useCallback, useMemo } from 'react'
import { useDrop } from 'react-dnd'
import { useAppDispatch } from '../app/hooks/reduxHooks'
import {
  removeFieldAndLayout,
  selectEditMode,
  selectElement,
  selectSelectedElementKey,
} from '../features/wizard/WizardSlice'
import { useSelector } from 'react-redux'
import { Delete } from '@mui/icons-material'
import DropTargetFormsPreview from '../features/dragAndDrop/DropTargetFormsPreview'
import HorizontalLayoutElementWithPlaceholder from './HorizontalLayoutElementWithPlaceholder'
import { useDragTarget, useDropTarget } from '../app/hooks'

export type RemoveWrapperProps = { editMode: boolean; handleRemove: MouseEventHandler; children: ReactNode }
const RemoveWrapper: FC<RemoveWrapperProps> = ({ editMode, handleRemove, children }) => {
  return (
    <>
      {editMode ? (
        <Grid container>
          <Grid item xs={11}>
            {children}
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={handleRemove}>
              <Delete></Delete>
            </IconButton>
          </Grid>
        </Grid>
      ) : (
        children
      )}
    </>
  )
}

type LayoutElementProps = {
  index: number
  direction: 'row' | 'column'
  state: JsonFormsState
  schema: JsonSchema
  visible: boolean
  path: string
  enabled: boolean
  element: UISchemaElement
  renderers?: JsonFormsRendererRegistryEntry[]
  cells?: JsonFormsCellRendererRegistryEntry[]
  parent: UISchemaElement[]
}

const LayoutElement = ({
  index,
  direction,
  state,
  schema,
  path,
  enabled,
  element: child,
  cells,
  parent,
  renderers,
}: LayoutElementProps) => {
  const rootSchema = getSchema(state)
  //const rootData = getData(state)
  const dispatch = useAppDispatch()
  const editMode = useSelector(selectEditMode)
  const selectedKey = useSelector(selectSelectedElementKey)
  const childPath = useMemo<string | undefined>(
    () => (child.type === 'Control' ? composeWithUi(child as ControlElement, path) : undefined),
    [child, path]
  )
  const resolvedSchema = useMemo<JsonSchema | undefined>(
    () =>
      child.type === 'Control'
        ? Resolve.schema(schema || rootSchema, (child as ControlElement).scope, rootSchema)
        : undefined,
    [schema, rootSchema, child]
  )

  const key = useMemo<string>(() => (!childPath ? `layout-${index}` : childPath), [childPath, index])
  const isGroup = useMemo<boolean>(() => child.type === 'Group', [child])
  const { handleAllDrop, draggedMeta } = useDropTarget({ child, childPath })

  const [{ isDragging }, dragRef] = useDragTarget({ child, childPath, resolvedSchema })

  const [{ isOver: isOver1, isOverCurrent: isOverCurrent1 }, dropRef] = useDrop(handleAllDrop, [handleAllDrop])
  const [{ isOver: isOver2, isOverCurrent: isOverCurrent2 }, dropRef2] = useDrop(handleAllDrop, [handleAllDrop])
  const isOver = isOver1 || isOver2
  const isOverCurrent = isOverCurrent1 || isOverCurrent2
  const handleSelect = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()
      // @ts-ignore
      dispatch(selectElement(key))
    },
    [dispatch, key]
  )

  const handleRemove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation()
      dispatch(removeFieldAndLayout({ path: key }))
    },
    [dispatch, key]
  )

  return (
    <>
      <Grid key={key} item ref={dropRef} xs onClick={handleSelect}>
        <Paper
          elevation={selectedKey === key ? 4 : 0}
          sx={{
            flexGrow: 1,
            display: isDragging ? 'none' : 'flex',
            backgroundColor: (theme) => (selectedKey === key ? theme.palette.primary.light : 'none'),
            padding: (theme) => theme.spacing(1, 2),
            cursor: 'grab',
          }}
          ref={dragRef}
        >
          {!isGroup && (
            <RemoveWrapper handleRemove={handleRemove} editMode={editMode}>
              <JsonFormsDispatch
                uischema={child}
                schema={schema}
                path={path}
                enabled={enabled}
                renderers={renderers}
                cells={cells}
              />
            </RemoveWrapper>
          )}
          {isGroup && (
            <JsonFormsDispatch
              uischema={child}
              schema={schema}
              path={path}
              enabled={enabled}
              renderers={renderers}
              cells={cells}
            />
          )}
        </Paper>
      </Grid>
      <Paper
        sx={{
          border: '1px dashed grey',
          opacity: isOver ? '1.0' : '0.2',
          // bgcolor: (theme) => (isOver ?  theme. : 'none'),
        }}
        ref={dropRef2}
      >
        {isOver && isOverCurrent && draggedMeta ? (
          <Paper sx={{ padding: (theme) => theme.spacing(1, 2), bgcolor: (theme) => theme.palette.secondary.light }}>
            <DropTargetFormsPreview metadata={draggedMeta} />
          </Paper>
        ) : null}
      </Paper>
    </>
  )
}

export interface MaterialLayoutRendererProps extends OwnPropsOfRenderer {
  elements: UISchemaElement[]
  direction: 'row' | 'column'
}

const MaterialLayoutRendererComponent = (props: MaterialLayoutRendererProps) => {
  const { visible, elements, schema, path, enabled, direction, renderers, cells, uischema } = props
  const ctx = useJsonForms()
  const state = { jsonforms: ctx }
  if ((!elements || elements.length < 2) && visible && direction === 'row') {
    return (
      <HorizontalLayoutElementWithPlaceholder
        path={path}
        elements={elements}
        layoutRendererProps={props}
      ></HorizontalLayoutElementWithPlaceholder>
    )
  } else if (isEmpty(elements)) {
    return null
  } else {
    return (
      <Box sx={{ display: visible ? 'block' : 'none' }}>
        <Grid container direction={direction} spacing={direction === 'row' ? 2 : 0}>
          {elements.map((element, index) => (
            <LayoutElement
              direction={direction}
              key={(path || '') + index}
              index={index}
              state={state}
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
export const LayoutWithDropZoneRenderer = React.memo(MaterialLayoutRendererComponent)

export interface AjvProps {
  ajv: Ajv
}

export const withAjvProps =
  <P extends {}>(Component: ComponentType<AjvProps & P>) =>
  (props: P) => {
    const ctx = useJsonForms()
    const ajv = getAjv({ jsonforms: { ...ctx } })

    // @ts-ignore
    return <Component {...props} ajv={ajv} />
  }
