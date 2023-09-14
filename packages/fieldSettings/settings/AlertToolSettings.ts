import { JsonSchema } from '@jsonforms/core'
import { ToolSetting } from '@formswizard/types'

const jsonSchema = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
    },
  },
}

const mapWizardSchemaToToolData = (wizardSchema: JsonSchema | null, uiSchema: any) => {
  return {
    text: uiSchema.text,
  }
}

// TODO: insteat of forcefully enforcing rules, we should just warn the user and prevent the update to the schema
// this makes the mapping between the toolData and the wizardSchema more complicated, because we need to check for errors
const mapToolDataToWizardUischema = (toolData: any, wizardUiSchema: any) => {
  return {
    ...wizardUiSchema,
    text: toolData.text ?? '',
  }
}
const mapToolDataToWizardSchema = (toolData: any, wizardSchema: JsonSchema | null) => {
  return {
    ...wizardSchema,
  }
}

const AlertToolSetting: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,

  jsonSchema,
  tester: (uiSchema, jsonSchema) => (uiSchema.type === 'Alert' || typeof (uiSchema as any).text === 'string' ? 1 : 0),

  toolSettingsMixins: [],
}
export default AlertToolSetting
