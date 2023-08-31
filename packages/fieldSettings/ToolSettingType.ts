import { JsonSchema, JsonSchema4, JsonSchema7, UISchemaElement } from '@jsonforms/core'

export type ToolSetting = {
  mapWizardSchemaToToolData: (wizardSchema: JsonSchema | null, uiSchema: any) => any
  mapToolDataToWizardSchema: (toolData: any, wizardSchema: JsonSchema) => JsonSchema
  mapToolDataToWizardUischema: (toolData: any, wizardUiSchema: any) => any
  isTool: (jsonSchema: JsonSchema | null, uiSchema: any) => boolean
  JsonSchema: JsonSchema
  toolSettingsMixins: any[]
}
