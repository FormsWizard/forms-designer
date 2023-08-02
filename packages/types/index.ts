import {JsonSchema, Labelable, Scopable, UISchemaElement} from "@jsonforms/core";

export type ScopableUISchemaElement = UISchemaElement & Scopable & Labelable

export type DraggableMeta = {
  name: string
  ToolIcon: any
}

export type DraggableComponent = Partial<DraggableMeta> & {
  jsonSchemaElement: JsonSchema
  uiSchema?: UISchemaElement
}

export type DraggableUISchemaElement = Partial<DraggableMeta> & {
  uiSchema: UISchemaElement
}

export type DraggableElement = DraggableComponent | DraggableUISchemaElement

export type JsonFormsEditState = {
  jsonSchema: JsonSchema
  uiSchema?: any
  selectedElementKey?: string | null
  editMode: boolean
}
