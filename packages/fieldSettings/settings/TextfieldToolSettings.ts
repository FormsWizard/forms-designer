import { JsonSchema7 } from '@jsonforms/core'
import ToolsettingParts from '../mixins/ToolSettingParts'
import { ToolSetting } from '../ToolSettingType'

const JsonSchema = {
  type: 'object',
  properties: {},
}

const mapWizardSchemaToToolData = (wizardSchema: JsonSchema7, uiSchema: any) => {
  return {}
}

// TODO: insteat of forcefully enforcing rules, we should just warn the user and prevent the update to the schema
// this makes the mapping between the toolData and the wizardSchema more complicated, because we need to check for errors
const mapToolDataToWizardUischema = (toolData: any, wizardUiSchema: any) => {
  return {
    ...wizardUiSchema,
  }
}
const mapToolDataToWizardSchema = (toolData: any, wizardSchema: JsonSchema7) => {
  return {
    ...wizardSchema,
  }
}

const TextfieldToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  JsonSchema,
  isTool: (jsonSchema: JsonSchema7, uiSchema) =>
    uiSchema && uiSchema?.type === 'Control' && jsonSchema?.type === 'string',
  toolSettingsMixins: [ToolsettingParts.Title],
}
export default TextfieldToolSettings
