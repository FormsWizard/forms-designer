import { useMemo } from 'react'
import {DraggableComponent} from "types";
import {JsonSchema} from "@jsonforms/core";
import {useDNDHooksContext} from "./DNDHooksContext";

type UseDragTargetProps = {
  child?: any
  name?: string
  resolvedSchema?: JsonSchema
}
export const useDragTarget = ({ child, name, resolvedSchema }: UseDragTargetProps) => {
  const { useDrag } = useDNDHooksContext()
  const componentMeta = useMemo<DraggableComponent | undefined>(
    () => (name && resolvedSchema) ? ({
      name,
      jsonSchemaElement: resolvedSchema,
      uiSchema: child,
    }) : undefined,
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
