import {JsonSchema} from '@jsonforms/core'
import {ToolSetting} from "@formswizard/types";

const jsonSchema = {
  type: 'object',
  properties: {
    mapNominatimFields: {
      type: 'boolean'
    },
  },
}

const mapWizardSchemaToToolData = (wizardSchema: JsonSchema | null, uiSchema: any) => {
  return {}
}

// this makes the mapping between the toolData and the wizardSchema more complicated, because we need to check for errors
const mapToolDataToWizardUischema = (toolData: any, wizardUiSchema: any) => {
  return {
    ...wizardUiSchema,
    ...(toolData?.mapNominatimFields ? {
      options: {
        mapNominatimFields: toolData?.mapNominatimFields
      }
    } : {})
  }
}
const mapToolDataToWizardSchema = (toolData: any, wizardSchema: JsonSchema | null) => {
  return {
    ...wizardSchema,
  }
}

export const LocationToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  jsonSchema,
  tester: ( uiSchema, jsonSchema) => ((jsonSchema?.type === 'string' && jsonSchema?.format === 'wktLiteral') ? 10 : 0),
  toolSettingsMixins: [],
}
