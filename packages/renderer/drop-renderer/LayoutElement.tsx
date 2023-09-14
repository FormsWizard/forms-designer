import type { UISchemaElement } from '@jsonforms/core'
import {
  composeWithUi,
  ControlElement,
  getSchema,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  Resolve,
} from '@jsonforms/core'
import { JsonFormsDispatch, useJsonForms } from '@jsonforms/react'
import { Box, Grid } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector, selectSelectedPath, selectPath } from '@formswizard/state'
import classnames from 'classnames'
import { useDNDHooksContext, useDragTarget, useDropTarget } from '@formswizard/react-hooks'

// export type RemoveWrapperProps = { editMode: boolean; handleRemove: MouseEventHandler; children: ReactNode }
// const RemoveWrapper: FC<RemoveWrapperProps> = ({ editMode, handleRemove, children }) => {
//   return (
//     <>
//       {editMode ? (
//         <Grid container>
//           <Grid item xs={11}>
//             {children}
//           </Grid>
//           <Grid item xs={1}>
//             <IconButton onClick={handleRemove}>
//               <Delete></Delete>
//             </IconButton>
//           </Grid>
//         </Grid>
//       ) : (
//         children
//       )}
//     </>
//   )
// }
type UISchemaElementWithPath = UISchemaElement & { path: string; structurePath?: string }
type LayoutElementProps = {
  index: number
  direction: 'row' | 'column'
  schema: JsonSchema
  visible: boolean
  path: string
  enabled: boolean
  element: UISchemaElement
  renderers?: JsonFormsRendererRegistryEntry[]
  cells?: JsonFormsCellRendererRegistryEntry[]
  parent: UISchemaElement[]
}

const LayoutElement = ({ index, schema, path, enabled, element: child, cells, renderers }: LayoutElementProps) => {
  const ctx = useJsonForms()
  const state = { jsonforms: ctx }
  const rootSchema = getSchema(state)
  const dispatch = useAppDispatch()
  const selectedPath = useAppSelector(selectSelectedPath)
  const controlName = useMemo<string | undefined>(
    () => (child.type === 'Control' ? composeWithUi(child as ControlElement, path) : undefined),
    [child, path]
  )
  const resolvedSchema = useMemo<JsonSchema | undefined>(
    () => Resolve.schema(schema || rootSchema, (child as ControlElement).scope, rootSchema),

    [schema, rootSchema, child]
  )
  const key = useMemo<string>(
    () => (controlName ? controlName : `${child.type}-${index}`),
    [controlName, index, child.type]
  )
  const { handleAllDrop, handleDropAtStart, draggedMeta } = useDropTarget({ child })
  const { useDrop, useDragLayer } = useDNDHooksContext()
  const anythingDragging = useDragLayer((monitor) => monitor.isDragging())
  const [{ isDragging }, dragRef] = useDragTarget({ child, name: controlName, resolvedSchema })
  const [{ isOver: isOver1, isOverCurrent: isOverCurrent1 }, dropRef] = useDrop(handleAllDrop, [handleAllDrop])
  const [{ isOver: isOver2, isOverCurrent: isOverCurrent2 }, dropRef2] = useDrop(handleAllDrop, [handleAllDrop])
  const [{ isOver: isOver3, isOverCurrent: isOverCurrent3 }, dropRef3] = useDrop(handleDropAtStart, [handleAllDrop])
  const isOverCurrent = isOverCurrent1 || isOverCurrent2
  const handleSelect = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()
      // @ts-ignore
      dispatch(selectPath(child.path))
    },
    [dispatch, key]
  )

  // const handleRemove = useCallback(
  //   (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //     event.stopPropagation()
  //     dispatch(removeFieldAndLayout({ path: key }))
  //   },
  //   [dispatch, key]
  // )

  return (
    <>
      {index === 0 && (
        <LayoutDropArea
          isOverCurrent={isOverCurrent3}
          dropRef={dropRef3}
          anythingDragging={isDragging || anythingDragging}
        ></LayoutDropArea>
      )}
      <Grid key={key} item ref={dropRef} xs onClick={handleSelect}>
        <Box
          // elevation={selectedKey === key ? 4 : 0}
          sx={{
            flexGrow: 1,
            display: 'flex',
            backgroundColor: (theme) =>
              // @ts-ignore
              selectedPath === child.path
                ? theme.palette.mode === 'dark'
                  ? theme.palette.grey[800]
                  : theme.palette.grey[200]
                : 'none',
            padding: (theme) => theme.spacing(1, 2),

            cursor: 'grab !important',
            ' * ': {
              cursor: 'grab !important',
            },
            ' > *': {
              flexGrow: 1,
            },
            transition: (theme) =>
              theme.transitions.create(['background-color', 'color'], {
                duration: theme.transitions.duration.short,
              }),
            /*':hover': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? theme.palette.grey.A100 : theme.palette.grey[700],
            },*/
          }}
          ref={dragRef}
        >
          <JsonFormsDispatch
            uischema={child}
            schema={schema}
            path={path}
            enabled={enabled}
            renderers={renderers}
            cells={cells}
          />
        </Box>
      </Grid>
      <LayoutDropArea
        isOverCurrent={isOverCurrent}
        dropRef={dropRef2}
        anythingDragging={anythingDragging}
      ></LayoutDropArea>
    </>
  )
}

type LayoutDropAreaProps = {
  isOverCurrent: boolean
  dropRef: any
  anythingDragging: boolean
}
function LayoutDropArea({ isOverCurrent, dropRef, anythingDragging }: LayoutDropAreaProps) {
  // const [dragging, setDragging, cancel] = useDelayedState<boolean>(false, { delay: 10, delayedValue: true })

  // useEffect(() => {
  //   setDragging(anythingDragging)
  //   if (anythingDragging !== dragging && !anythingDragging) {
  //     cancel(false)
  //   }
  // }, [anythingDragging])

  return (
    <Box
      sx={{
        opacity: isOverCurrent ? '1.0' : '0.3',
      }}
      ref={dropRef}
    >
      <Box
        className={classnames('is-dropzone', { 'is-over-dropzone': isOverCurrent })}
        sx={{
          display: 'flex',
          border: anythingDragging ? `1px dashed darkgray` : '1px dashed transparent',
          borderRadius: '2px',
          boxSizing: 'border-box',
          // height: '1.5em',
          textAlign: 'center',
          verticalAlign: 'middle',
          margin: (theme) => theme.spacing(1, 2),
          transition: (theme) =>
            theme.transitions.create(['border'], {
              duration: theme.transitions.duration.short,
            }),
        }}
      >
        <Box
          sx={{
            opacity: anythingDragging ? '1.0' : '0',
            margin: 'auto',
            fontSize: '2em',
            transition: (theme) =>
              theme.transitions.create(['opacity'], {
                duration: theme.transitions.duration.standard,
              }),
          }}
        >
          +
        </Box>
      </Box>
    </Box>
  )
}

export default LayoutElement
