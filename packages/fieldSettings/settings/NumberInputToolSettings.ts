import { JsonSchema } from '@jsonforms/core'
import ToolsettingParts from '../mixins/ToolSettingParts'
import {ToolSetting} from "@formswizard/types";


const jsonSchema = {
  type: 'object',
  properties: {
    min: {
      type: "integer"
    },
    max: {
      type: "integer"
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
    maximum: toolData.max

  }
}

const NumberInputToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  jsonSchema,
  tester: (jsonSchema: JsonSchema | null, uiSchema) =>
      (uiSchema && uiSchema?.type === 'Control' && jsonSchema?.type === 'integer') ? 1 : 0,
  toolSettingsMixins: [ToolsettingParts.Title],
}
export default NumberInputToolSettings
