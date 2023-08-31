import { JsonSchema } from '@jsonforms/core'
import ToolsettingParts from '../mixins/ToolSettingParts'
import { ToolSetting } from '../ToolSettingType'

const JsonSchema = {
  type: 'object',
  properties: {}
}

const mapWizardSchemaToToolData = () => {
  return {}
}

// TODO: insteat of forcefully enforcing rules, we should just warn the user and prevent the update to the schema
// this makes the mapping between the toolData and the wizardSchema more complicated, because we need to check for errors
const mapToolDataToWizardUischema = (toolData: any, wizardUiSchema: any) => {
  return {
    ...wizardUiSchema,
  }
}
const mapToolDataToWizardSchema = (toolData: any, wizardSchema: JsonSchema | null) => {
  // console.log(wizardSchema)
  // const regexMap = {
  //   "phone number": "^[0-9]{10,15}$"
  // }
  // let props = {} as any
  // if(toolData.forceFormat === "email") {
  //   props.format = "email"
  // } else {
  //   props.format = undefined
  // }
  // if(regexMap[toolData.forceFormat]) {
  //   props.pattern = regexMap[toolData.forceFormat]
  // } else {
  //   props.pattern = undefined
  // }
  return {
    ...wizardSchema
  }
}

const TextfieldToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  JsonSchema,
  isTool: (jsonSchema: JsonSchema | null, uiSchema) =>
    uiSchema && uiSchema?.type === 'Control' && jsonSchema?.type === 'string',
  toolSettingsMixins: [ToolsettingParts.Title],
}
export default TextfieldToolSettings
