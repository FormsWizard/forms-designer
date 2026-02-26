import { ToolSettingsMixin } from '@formswizard/types'

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

  mapAddonDataToWizardUISchema: (toolData, uiSchema, rootSchema) => {
    return {
      ...uiSchema,
      label: toolData.label,
    }
  },
}

const PrimaryFieldPart: ToolSettingsMixin = {
  jsonSchemaElement: {
    isPrimaryFieldFor: {
      type: 'string',
      enum: ['none', 'title', 'description', 'image'],
    },
  },
  mapWizardToAddonData: (previousData, wizardSchema) => {
    return {
      ...previousData,
      isPrimaryFieldFor: wizardSchema?.['x-primaryField'] ? wizardSchema['x-primaryField'] === 'title' ? 'label' : wizardSchema['x-primaryField'] : 'none',
    }
  },
  mapAddonDataToWizardUISchema: (toolData, uiSchema) => uiSchema,
  mapAddonDataToWizardSchema: (toolData, wizardSchema, rootSchema) => {
    const { isPrimaryFieldFor } = toolData || {};
    if (isPrimaryFieldFor && isPrimaryFieldFor !== 'none') {
      return {
        ...wizardSchema,
        'x-primaryField': isPrimaryFieldFor === 'label' ? 'title' : isPrimaryFieldFor,
      };
    } else {
      // @ts-ignore
      const { ['x-primaryField']: _removed, ...rest } = wizardSchema || {};
      return rest;
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

export const ToolsettingParts = {
  Title: TitlePart,
  PrimaryField: PrimaryFieldPart,
}

