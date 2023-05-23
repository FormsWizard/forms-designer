import { JsonSchema7 } from '@jsonforms/core'

export type ToolSetting = {
  mapWizardSchemaToToolData: (wizardSchema: JsonSchema7, uiSchema: any) => any
  mapToolDataToWizardSchema: (toolData: any, wizardSchema: JsonSchema7) => JsonSchema7
  mapToolDataToWizardUischema: (toolData: any, wizardUiSchema: any) => any
  isTool: (jsonSchema: JsonSchema7) => boolean
  JsonSchema: JsonSchema7
}
