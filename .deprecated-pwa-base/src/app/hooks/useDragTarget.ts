import { useMemo } from 'react'
import { DraggableComponent } from '../../features/wizard/WizardSlice'
import { useDrag } from 'react-dnd'

export const useDragTarget = ({ child, name, resolvedSchema }) => {
  const componentMeta = useMemo<DraggableComponent | undefined>(
    () => ({
      name,
      jsonSchemaElement: resolvedSchema,
      uiSchema: child,
    }),
    [name, child, resolvedSchema]
  )
  return useDrag(
    () => ({
      type: 'MOVEBOX',
      item: { componentMeta },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const didDrop = monitor.didDrop()
        if (didDrop) {
        }
      },
    }),
    [componentMeta]
  )
}
