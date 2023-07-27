import { useCallback, useState } from 'react'
import {
  insertControl,
  isDraggableComponent,
  isDraggableUISchemaElement, useAppDispatch,
} from 'state'
import { Scopable, UISchemaElement } from '@jsonforms/core'
import { pathSegmentsToPath, pathToPathSegments, scopeToPathSegments } from 'utils/uiSchemaHelpers'
import {DraggableComponent, DraggableUISchemaElement} from "types";

export type UseDropTargetProps = {
  child: UISchemaElement | undefined
  uiSchemaPath?: string
}
export const useDropTarget = ({ child, uiSchemaPath }: UseDropTargetProps) => {
  const [draggedMeta, setDraggedMeta] = useState<DraggableComponent | undefined>()
  const dispatch = useAppDispatch()
  const handleDrop = useCallback(
    (componentMeta: DraggableComponent) => {
      // @ts-ignore
      child && dispatch(
        insertControl({
          draggableMeta: componentMeta,
          child,
          uiSchemaPath,
        })
      )
    },
    [dispatch, child]
  )
  const handleMove = useCallback(
    (componentMeta: DraggableComponent | DraggableUISchemaElement) => {
      const uiSchemaPath: string | undefined = (componentMeta.uiSchema as any)?.path
      if (isDraggableComponent(componentMeta)) {
        //TDOD very confusing using the name as path here, we should introduce a path property within DraggableComponent
        const path = componentMeta.name || ''
        if(!child) {

          return
        }
        let pathSegments = path.includes('.') ? pathToPathSegments(path) : [path]
        const childScope = (child as Scopable).scope,
          name = pathSegments.pop()

        //FIXME: the following should not be necessary, but somehow the path is not set correctly, when root path
        if (pathSegments.length === 0) {
          pathSegments = [path]
        }
        if (childScope && pathSegmentsToPath(scopeToPathSegments(childScope)) === componentMeta.name) {
          
          return
        }

        // @ts-ignore
        const draggableMeta: DraggableComponent = {
          ...componentMeta,
          name,
        }
        dispatch(
          insertControl({
            draggableMeta,
            child,
            remove: {
              fieldPath: path,
              layoutPath: uiSchemaPath,
            },
          })
        )
      } else {
        if(!child) {
          
          return
        }
        if (isDraggableUISchemaElement(componentMeta)) {
          dispatch(
            insertControl({
              draggableMeta: componentMeta,
              child,
              remove: {
                layoutPath: uiSchemaPath,
              },
            })
          )
        }
      }
    },
    [dispatch, child]
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
      hover: ({ componentMeta }: {componentMeta: DraggableComponent | DraggableUISchemaElement}, monitor: any) => {
        if (monitor.getItemType() === 'MOVEBOX') {
          const uiSchemaChild = componentMeta?.uiSchema
          if(!uiSchemaChild) {
            
            return
          }
          const { type, scope, ...rest } = uiSchemaChild  as UISchemaElement & Scopable
          const draggableMeta = {
            ...componentMeta,
            name: componentMeta.name ? componentMeta.name.split('.').pop() : 'layout',
            uiSchema: rest,
          }
          setDraggedMeta(draggableMeta as DraggableComponent)
          return
        }
        setDraggedMeta(componentMeta as DraggableComponent)
      },
      collect: (monitor: any) => ({
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
