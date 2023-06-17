import { useCallback, useState } from 'react'
import {
  DraggableComponent,
  DraggableUISchemaElement,
  insertControl,
  isDraggableComponent,
  isDraggableUISchemaElement,
} from '../../features/wizard/WizardSlice'
import { Scopable, UISchemaElement } from '@jsonforms/core'
import { useAppDispatch } from './reduxHooks'
import { pathSegmentsToPath, pathToPathSegments, scopeToPathSegments } from '../../utils/uiSchemaHelpers'

export type UseDropTargetProps = {
  child: UISchemaElement
  childPath: string
  uiSchemaPath?: string
}
export const useDropTarget = ({ child, childPath, uiSchemaPath }: UseDropTargetProps) => {
  const dispatch = useAppDispatch()
  const [draggedMeta, setDraggedMeta] = useState<DraggableComponent | undefined>()
  const handleDrop = useCallback(
    (componentMeta: DraggableComponent) => {
      // @ts-ignore
      dispatch(
        insertControl({
          draggableMeta: componentMeta,
          child,
          path: childPath,
          uiSchemaPath
        })
      )
    },
    [dispatch, child, childPath]
  )
  const handleMove = useCallback(
    (componentMeta: DraggableComponent | DraggableUISchemaElement) => {
      const uiSchemaPath: string | undefined = (componentMeta.uiSchema as any)?.path
      if (isDraggableComponent(componentMeta)) {
        //TDOD very confusing using the name as path here, we should introduce a path property within DraggableComponent
        const path = componentMeta.name
        let pathSegments = path.includes('.') ? pathToPathSegments(path) : [path]
        const childScope = (child as Scopable).scope,
          name = pathSegments.pop()

        //FIXME: the following should not be necessary, but somehow the path is not set correctly, when root path
        if (pathSegments.length === 0) {
          pathSegments = [path]
        }
        if (childScope && pathSegmentsToPath(scopeToPathSegments(childScope)) === componentMeta.name) {
          console.info('Dropped on my self, ignoring')
          return
        }

        const draggableMeta: DraggableComponent = {
          ...componentMeta,
          name,
        }
        dispatch(
          insertControl({
            draggableMeta,
            child,
            path: childPath,
            remove: {
              fieldPath: path,
              layoutPath: uiSchemaPath,
            },
          })
        )
      } else {
        if (isDraggableUISchemaElement(componentMeta)) {
          dispatch(
            insertControl({
              draggableMeta: componentMeta,
              child,
              path: childPath,
              remove: {
                layoutPath: uiSchemaPath,
              },
            })
          )
        }
      }
    },
    [dispatch, child, childPath]
  )

  const handleAllDrop = useCallback(
    () => ({
      accept: ['DRAGBOX', 'MOVEBOX'],
      //@ts-ignore
      drop: ({ componentMeta }, monitor) => {
        if (monitor.didDrop()) return
        if (monitor.getItemType() === 'MOVEBOX') {
          handleMove(componentMeta)
        } else {
          handleDrop(componentMeta)
        }
      },
      hover: ({ componentMeta }, monitor) => {
        if (monitor.getItemType() === 'MOVEBOX') {
          const { type, scope, ...rest } = componentMeta?.uiSchema || {}
          const draggableMeta = {
            ...componentMeta,
            name: componentMeta.name ? componentMeta.name.split('.').pop() : 'layout',
            uiSchema: rest,
          }
          setDraggedMeta(draggableMeta)
          return
        }
        setDraggedMeta(componentMeta)
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [handleDrop, setDraggedMeta]
  )

  return {
    handleAllDrop,
    draggedMeta,
    handleDrop,
    handleMove,
  }
}
