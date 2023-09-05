import { JsonSchema } from '@jsonforms/core'
import ToolsettingParts from '../mixins/ToolSettingParts'
import {ToolSetting} from "@formswizard/types";


const jsonSchema = {
  type: 'object',
  properties: {
    options: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
}

const mapWizardSchemaToToolData = (wizardSchema: JsonSchema | null, uiSchema: any) => {
  return {
    // @ts-ignore
    options: wizardSchema?.items?.enum ?? [],
  }
}

// TODO: insteat of forcefully enforcing rules, we should just warn the user and prevent the update to the schema
// this makes the mapping between the toolData and the wizardSchema more complicated, because we need to check for errors
const mapToolDataToWizardUischema = (toolData: any, wizardUiSchema: any) => {
  // enum item must not be undefined
  // enum must not have duplicates
  // enum must have non-empty array
  // enum must NOT have fewer than 1 items

  return {
    ...wizardUiSchema,
  }
}

const mapToolDataToWizardSchema = (toolData: any, wizardSchema: JsonSchema | null) => {
  let newEnum = toolData.options
    .map((line) => (line === undefined ? '' : line))
    .filter((line, index, array) => !array.slice(index + 1).includes(line))
  if (newEnum.length === 0) {
    newEnum = ['']
  }

  return {
    ...wizardSchema,
    items: { ...(wizardSchema as any).items, enum: newEnum },
  }
}

const MultiSelectToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  tester: (jsonSchema) =>
    jsonSchema &&
    jsonSchema.type === 'array' &&
    //@ts-ignore
    jsonSchema?.items?.type === 'string' &&
    (jsonSchema as any).uniqueItems === true
      ? 1
      : 0,
  jsonSchema,
  toolSettingsMixins: [ToolsettingParts.Title],
}

export default MultiSelectToolSettings
