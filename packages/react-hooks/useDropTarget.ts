import { useCallback, useState } from 'react'
import { UISchemaElement } from '@jsonforms/core'
import { useAppDispatch,
  DraggableComponent,
  DraggableUISchemaElement,
  insertControl,
  moveControl
} from "@formswizard/state"

export type UseDropTargetProps = {
  child: UISchemaElement
  isPlaceholder?: Boolean
}
export const useDropTarget = ({ child, isPlaceholder = false }: UseDropTargetProps) => {
  const dispatch = useAppDispatch()
  const [draggedMeta, setDraggedMeta] = useState<DraggableComponent | undefined>()
  const handleDrop = useCallback(
    (componentMeta: DraggableComponent, placeBefore = false) => {
      // @ts-ignore
      dispatch(
        insertControl({
          draggableMeta: componentMeta,
          child,
          isPlaceholder,
          placeBefore,
        })
      )
    },
    [dispatch, child, isPlaceholder]
  )
  const handleMove = useCallback(
    (componentMeta: DraggableComponent | DraggableUISchemaElement, placeBefore = false) => {
      // const uiSchemaPath: string | undefined = (componentMeta.uiSchema as any)?.path
      dispatch(
        moveControl({
          draggableMeta: componentMeta,
          child,
          placeBefore,
        })
      )
      // if (isDraggableComponent(componentMeta)) {
      //   //TDOD very confusing using the name as path here, we should introduce a path property within DraggableComponent
      //   const path = componentMeta.name
      //   let pathSegments = path.includes('.') ? pathToPathSegments(path) : [path]
      //   const childScope = (child as Scopable).scope,
      //     name = pathSegments.pop()

      //   //FIXME: the following should not be necessary, but somehow the path is not set correctly, when root path
      //   if (pathSegments.length === 0) {
      //     pathSegments = [path]
      //   }
      //   if (childScope && pathSegmentsToPath(scopeToPathSegments(childScope)) === componentMeta.name) {
      //     console.info('Dropped on my self, ignoring')
      //     return
      //   }

      //   const draggableMeta: DraggableComponent = {
      //     ...componentMeta,
      //     name,
      //   }
      //   dispatch(
      //     moveControl({
      //       draggableMeta,
      //       child,
      //     })
      //   )
      // } else {
      //   if (isDraggableUISchemaElement(componentMeta)) {
      //     dispatch(
      //       insertControl({
      //         draggableMeta: componentMeta,
      //         child,
      //         remove: {
      //           layoutPath: uiSchemaPath,
      //         },
      //       })
      //     )
      //   }
      // }
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
      //@ts-ignore
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
      collect: (monitor: any) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [handleDrop, setDraggedMeta]
  )
  // @ts-ignore
  const handleDropAtStart = useCallback(
    () => ({
      accept: ['DRAGBOX', 'MOVEBOX'],
      //@ts-ignore
      drop: ({ componentMeta }, monitor) => {
        if (monitor.didDrop()) return
        if (monitor.getItemType() === 'MOVEBOX') {
          handleMove(componentMeta, true)
        } else {
          handleDrop(componentMeta, true)
        }
      },
      //@ts-ignore
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
      collect: (monitor: any) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [handleDrop, setDraggedMeta]
  )

  return {
    handleAllDrop,
    handleDropAtStart,
    draggedMeta,
    handleDrop
  }
}
