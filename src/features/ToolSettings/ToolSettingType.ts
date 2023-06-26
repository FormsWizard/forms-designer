import { JsonSchema7, UISchemaElement } from '@jsonforms/core'

export type ToolSetting = {
  mapWizardSchemaToToolData: (wizardSchema: JsonSchema7, uiSchema: UISchemaElement) => any
  mapToolDataToWizardSchema: (toolData: any, wizardSchema: JsonSchema7) => JsonSchema7
  mapToolDataToWizardUischema: (toolData: any, wizardUiSchema: UISchemaElement) => any
  isTool: (jsonSchema: JsonSchema7, uiSchema: any) => boolean
  JsonSchema: JsonSchema7
  toolSettingsMixins: [any]
}
