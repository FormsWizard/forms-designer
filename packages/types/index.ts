import { JsonSchema, Labelable, Scopable, UISchemaElement } from '@jsonforms/core'

export type ScopableUISchemaElement = UISchemaElement & Scopable & Labelable

export type DraggableMeta = {
  name: string
  ToolIconName?: string
}

export type DraggableComponent = DraggableMeta & {
  jsonSchemaElement: JsonSchema
  uiSchema?: UISchemaElement
}

export type DraggableUISchemaElement = DraggableMeta & {
  uiSchema: UISchemaElement
}

export type DraggableElement = DraggableComponent | DraggableUISchemaElement

export type JsonFormsEditState = {
  jsonSchema: JsonSchema
  uiSchema?: any
  selectedElementKey?: string | null
  editMode: boolean
}
