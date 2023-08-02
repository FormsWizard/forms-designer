import { JsonSchema, JsonSchema4, JsonSchema7, UISchemaElement } from '@jsonforms/core'

export type ToolSetting = {
  mapWizardSchemaToToolData: (wizardSchema: JsonSchema, uiSchema: UISchemaElement) => any
  mapToolDataToWizardSchema: (toolData: any, wizardSchema: JsonSchema) => JsonSchema
  mapToolDataToWizardUischema: (toolData: any, wizardUiSchema: UISchemaElement) => any
  isTool: (jsonSchema: JsonSchema, uiSchema: any) => boolean
  JsonSchema: JsonSchema7
  toolSettingsMixins: any[]
}
