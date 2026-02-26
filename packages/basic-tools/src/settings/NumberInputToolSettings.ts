import { ToolsettingParts } from '@formswizard/fieldsettings'
import { ToolSetting, JsonSchema } from '@formswizard/types'

const jsonSchema = {
  type: 'object',
  properties: {
    min: {
      type: 'integer',
    },
    max: {
      type: 'integer',
    },
    floatingPoint: {
      type: 'boolean',
    },
  },
}

const mapWizardSchemaToToolData = (wizardSchema: JsonSchema | null, uiSchema: any) => {
  return {}
}

// TODO: insteat of forcefully enforcing rules, we should just warn the user and prevent the update to the schema
// this makes the mapping between the toolData and the wizardSchema more complicated, because we need to check for errors
const mapToolDataToWizardUischema = (toolData: any, wizardUiSchema: any) => {
  return {
    ...wizardUiSchema,
  }
}
const mapToolDataToWizardSchema = (toolData: any, wizardSchema: JsonSchema) => {
  return {
    ...wizardSchema,
    minimum: toolData.min,
    maximum: toolData.max,
    type: toolData.floatingPoint ? 'number' : 'integer' as ('number' | 'integer'),
  }
}

const NumberInputToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  jsonSchema,
  tester: (uiSchema, jsonSchema: JsonSchema | null) =>
    uiSchema && uiSchema?.type === 'Control' && (jsonSchema?.type === 'integer' || jsonSchema?.type === 'number') ? 1 : 0,
  toolSettingsMixins: [ToolsettingParts.Title],
}
export default NumberInputToolSettings
