import { ToolsettingParts } from '@formswizard/fieldsettings'
import { ToolSetting, JsonSchema } from '@formswizard/types'

const jsonSchema = {
  type: 'object',
  properties: {
    multiline: {
      type: 'boolean',
      title: 'multiline',
    },
  },
}

const mapWizardSchemaToToolData = (wizardSchema: JsonSchema | null, uiSchema: any) => {
  return {
    multiline: uiSchema?.options?.multi || false,
  }
}

// TODO: insteat of forcefully enforcing rules, we should just warn the user and prevent the update to the schema
// this makes the mapping between the toolData and the wizardSchema more complicated, because we need to check for errors
const mapToolDataToWizardUischema = (toolData: any, wizardUiSchema: any) => {
  const result = {
    ...wizardUiSchema,
    options: {
      ...(wizardUiSchema.options ?? {}),
    },
  }
  
  // Handle multiline option
  if (toolData.multiline) {
    result.options.multi = true
  } else {
    // Remove multi option if it exists and multiline is false
    delete result.options.multi
  }
  
  // Remove options object if it's empty
  if (Object.keys(result.options).length === 0) {
    delete result.options
  }
  
  return result
}
const mapToolDataToWizardSchema = (toolData: any, wizardSchema: JsonSchema | null) => {
  return {
    ...wizardSchema,
  }
}

const TextfieldToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  jsonSchema,
  tester: (uiSchema, jsonSchema) => (uiSchema && uiSchema?.type === 'Control' && jsonSchema?.type === 'string' ? 1 : 0),
  toolSettingsMixins: [ToolsettingParts.Title, ToolsettingParts.PrimaryField],
}
export default TextfieldToolSettings
