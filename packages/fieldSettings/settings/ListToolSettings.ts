import { JsonSchema, JsonSchema7 } from '@jsonforms/core'
import ToolsettingParts from '../mixins/ToolSettingParts'
import {ToolSetting} from "@formswizard/types";


const jsonSchema = {
  type: 'object',
  properties: {
    columns: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    showSortButtons: {
      type: 'boolean',
      label: 'showSortButtons',
    },
  },
}

const mapWizardSchemaToToolData = (wizardSchema: JsonSchema | null, uiSchema: any) => {
  return {
    // @ts-ignore
    columns: Object.keys(wizardSchema?.items?.properties ?? []),
    showSortButtons: uiSchema?.options?.showSortButtons === true,
  }
}

// TODO: insteat of forcefully enforcing rules, we should just warn the user and prevent the update to the schema
// this makes the mapping between the toolData and the wizardSchema more complicated, because we need to check for errors
const mapToolDataToWizardUischema = (toolData: any, wizardUiSchema: any) => {
  return {
    ...wizardUiSchema,
    options: { showSortButtons: toolData.showSortButtons },
  }
}
const mapToolDataToWizardSchema = (toolData: any, wizardSchema: JsonSchema | null) => {
  const newProperties = toolData.columns.reduce(
    (prev: any, column: string) => ({
      ...prev,
      [column]: {
        type: 'string',
      },
    }),
    {}
  )

  return {
    ...wizardSchema,
    items: {
      ...(wizardSchema as any).items,
      properties: newProperties,
    },
  }
}

const ListToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  jsonSchema,
  tester: (uiSchema, jsonSchema) =>
    jsonSchema && jsonSchema.type === 'array' && (jsonSchema?.items as JsonSchema7 | undefined)?.type === 'object' ? 1 : 0,
  toolSettingsMixins: [ToolsettingParts.Title],
}
export default ListToolSettings
