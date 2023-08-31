import { JsonSchema, JsonSchema4, JsonSchema7, UISchemaElement } from '@jsonforms/core'

export type ToolSetting = {
  mapWizardSchemaToToolData: (wizardSchema: JsonSchema7, uiSchema: any) => any
  mapToolDataToWizardSchema: (toolData: any, wizardSchema: any) => JsonSchema
  mapToolDataToWizardUischema: (toolData: any, wizardUiSchema: any) => any
  isTool: (jsonSchema: any, uiSchema: any) => boolean
  JsonSchema: JsonSchema7
  toolSettingsMixins: any[]
}
