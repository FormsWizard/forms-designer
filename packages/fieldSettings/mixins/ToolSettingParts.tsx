import {JsonSchema7} from '@jsonforms/core'
import {ToolSettingsMixin} from "@formswizard/types";

const TitlePart: ToolSettingsMixin = {
  jsonSchemaElement: {
    label: {
      type: 'string',
    },
  },
  mapWizardToAddonData: (previousData, wizardSchema, uiSchema) => {
    return {
      ...previousData,
      label: uiSchema.label,
    }
  },

  mapAddonDataToWizardUISchema: (toolData, uiSchema) => {
    return {
      ...uiSchema,
      label: toolData.label,
    }
  },
}
// const TextPart = {
//   jsonSchema: {
//     type: 'object',
//     properties: {
//       label: {
//         type: 'string',
//       },
//     },
//   },
//   mapAddonDataToWizardSchema: null,
//   mapWizardToAddonData: (previousData, wizardSchema: JsonSchema7, uiSchema: any) => {
//     return {
//       ...previousData,
//       label: uiSchema.label,
//     }
//   },

//   mapAddonDataToWizardUISchema: (toolData, uiSchema: any) => {
//     return {
//       ...uiSchema,
//       label: toolData.label,
//     }
//   },
// }

const ToolsettingParts = {
  Title: TitlePart,
}

export default ToolsettingParts
