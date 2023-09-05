import {
  JsonSchema,
  Labelable,
  Scopable,
  UISchemaElement,
  TesterContext,
  JsonFormsRendererRegistryEntry,
} from '@jsonforms/core'

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
export type RankedToolTester = (uischema: UISchemaElement, schema: JsonSchema | null, context: TesterContext) => number

type ToolSettingsAbstract = {}

export type ToolSettingsMixin = {
  mapWizardToAddonData: (previousData, wizardSchema: JsonSchema | null, uiSchema: any) => any
  mapAddonDataToWizardSchema?: (toolData: any, wizardSchema: JsonSchema) => JsonSchema
  mapAddonDataToWizardUISchema: (toolData: any, uiSchema: any) => any
  jsonSchemaElement: JsonSchema['properties']
}

export type ToolSetting = ToolSettingsAbstract & {
  mapWizardSchemaToToolData: (wizardSchema: JsonSchema | null, uiSchema: any) => any
  mapToolDataToWizardSchema: (toolData: any, wizardSchema: JsonSchema) => JsonSchema
  mapToolDataToWizardUischema: (toolData: any, wizardUiSchema: any) => any
  tester: RankedToolTester
  jsonSchema: JsonSchema
  toolSettingsMixins: ToolSettingsMixin[]
}

export type PluggableToolDefinition = {
  rendererRegistry: JsonFormsRendererRegistryEntry[]
  dropRendererRegistry: JsonFormsRendererRegistryEntry[]
  toolSettings: ToolSetting[]
  toolBoxElements: DraggableElement[]
}
