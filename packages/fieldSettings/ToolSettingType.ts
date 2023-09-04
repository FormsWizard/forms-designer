import { JsonSchema } from '@jsonforms/core'
import { RankedToolTester } from '@formswizard/types'

export type ToolSetting = {
  mapWizardSchemaToToolData: (wizardSchema: JsonSchema | null, uiSchema: any) => any
  mapToolDataToWizardSchema: (toolData: any, wizardSchema: JsonSchema) => JsonSchema
  mapToolDataToWizardUischema: (toolData: any, wizardUiSchema: any) => any
  tester: RankedToolTester
  JsonSchema: JsonSchema
  toolSettingsMixins: any[]
}
