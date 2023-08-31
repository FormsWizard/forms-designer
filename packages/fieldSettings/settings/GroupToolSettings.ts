import { JsonSchema } from '@jsonforms/core'
import ToolsettingParts from '../mixins/ToolSettingParts'
import { ToolSetting } from '../ToolSettingType'

const FieldSchema = {
  type: 'object',
  properties: {},
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
  }
}

const GroupToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  JsonSchema:FieldSchema,
  isTool: (jsonSchema: JsonSchema | null, uiSchema) =>
    //@ts-ignore
    !!uiSchema && uiSchema?.type === 'Group',
  toolSettingsMixins: [ToolsettingParts.Title],
}
export default GroupToolSettings
