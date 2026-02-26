import { JsonSchema } from '@formswizard/types'
export type JsonFormsEditState = {
  jsonSchema: JsonSchema
  definitions: Record<string, JsonSchema>
  uiSchema?: any
  // selectedElementKey?: string | null
  selectedPath?: string
  uiSchemas: Record<string, any>
  selectedDefinition: string,
  definitionsKey: "definitions" | "$defs"
}

export const exampleBaseIRI = "http://forms-designer.winzlieb.eu/example#"
const typeNameToTypeIRI = (typeName: string) => `${exampleBaseIRI}${typeName}`

export const exampleInitialState: JsonFormsEditState = {
  jsonSchema: {
    type: 'object',
    properties: {}
  },
  uiSchema: { type: 'VerticalLayout', elements: []},
  definitions: {},
  uiSchemas: {},
  selectedDefinition: 'Root',
  definitionsKey: "definitions"
}
