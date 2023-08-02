import { JsonSchema7 } from '@jsonforms/core'
import ToolsettingParts from '../mixins/ToolSettingParts'
import { ToolSetting } from '../ToolSettingType'

const JsonSchema = {
  type: 'object',
  properties: {
    options: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    format: {
      type: 'boolean',
      title: 'als Dropdown anzeigen',
    },
  },
}

const mapWizardSchemaToToolData = (wizardSchema: JsonSchema7, uiSchema: any) => {
  return {
    options: wizardSchema.enum,
    format: uiSchema?.options?.format !== 'radio',
  }
}

// TODO: insteat of forcefully enforcing rules, we should just warn the user and prevent the update to the schema
// this makes the mapping between the toolData and the wizardSchema more complicated, because we need to check for errors
const mapToolDataToWizardUischema = (toolData: any, wizardUiSchema: any) => {
  return {
    ...wizardUiSchema,
    options: { format: toolData.format ? 'default' : 'radio' },
  }
}
const mapToolDataToWizardSchema = (toolData: any, wizardSchema: JsonSchema7) => {
  // enum item must not be undefined
  // enum must not have duplicates
  // enum must have non-empty array
  // enum must NOT have fewer than 1 items
  let newEnum = toolData.options
    .map((line) => (line === undefined ? '' : line))
    .filter((line, index, array) => !array.slice(index + 1).includes(line))

  if (newEnum.length === 0) {
    newEnum = ['']
  }

  return {
    ...wizardSchema,
    enum: newEnum,
  }
}

const SelectToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  JsonSchema,
  isTool: (jsonSchema: JsonSchema7) =>
    //@ts-ignore
    jsonSchema && (jsonSchema.type === 'select' || typeof jsonSchema.enum === 'object'),
  toolSettingsMixins: [ToolsettingParts.Title],
}
export default SelectToolSettings
