import { DraggableComponent } from '../wizard/WizardSlice'
import { updateScopeOfUISchemaElement } from '../../utils/uiSchemaHelpers'
export const basicDraggableComponents: DraggableComponent[] = [
  {
    name: 'Textfeld',
    jsonSchemaElement: {
      type: 'string',
    },
  },
  {
    name: 'Datumsfeld',
    jsonSchemaElement: {
      type: 'string',
      format: 'date',
    },
  },
  {
    name: 'Checkbox',
    jsonSchemaElement: {
      type: 'boolean',
    },
  },
  {
    name: 'Mehrzeiliges Textfeld',
    jsonSchemaElement: {
      type: 'string',
    },
    uiSchema: {
      type: 'Control',
      options: {
        multi: true,
      },
    },
  },
  {
    name: 'Radio Buttons',
    jsonSchemaElement: {
      type: 'string',
      enum: ['One', 'Two', 'Three'],
    },
    uiSchema: {
      type: 'Control',
      options: {
        format: 'radio',
      },
    },
  },
  {
    name: 'Multiselect',
    jsonSchemaElement: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',

        enum: ['foo', 'bar', 'foobar'],
      },
    },
    uiSchema: {
      type: 'Control',
      options: {
        format: 'combo',
      },
    },
  },
  {
    name: 'leeres horizontales layout',
    jsonSchemaElement: {},
    uiSchema: {
      type: 'HorizontalLayout',
    },
  },

  {
    name: 'gruppe',
    jsonSchemaElement: {
      type: 'object',
      properties: {},
    },
    uiSchema: updateScopeOfUISchemaElement('#', '#/properties/gruppe', {
      type: 'Group',
      //@ts-ignore
      label: 'Gruppe',
      elements: [],
    }),
  },
]

export const advancedDraggableComponents: DraggableComponent[] = [
  {
    name: 'person',
    jsonSchemaElement: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          enum: ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'],
        },
        givenName: {
          type: 'string',
        },
        familyName: {
          type: 'string',
        },
        birthDate: {
          type: 'string',
          format: 'date',
        },
        nationality: {
          type: 'string',
          enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other'],
        },
      },
    },
    uiSchema: updateScopeOfUISchemaElement('#', '#/properties/person', {
      type: 'Group',
      //@ts-ignore
      label: 'Person',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/title',
            },
            {
              type: 'Control',
              scope: '#/properties/givenName',
            },
            {
              type: 'Control',
              scope: '#/properties/familyName',
            },
          ],
        },
        {
          type: 'HorizontalLayout',

          elements: [
            {
              type: 'Control',
              scope: '#/properties/birthDate',
            },
            {
              type: 'Control',
              scope: '#/properties/nationality',
            },
          ],
        },
      ],
    }),
  },

  {
    name: 'horizontalTest',
    //@ts-ignore
    label: 'horizontal layout mit einem Element',
    jsonSchemaElement: {
      type: 'object',

      properties: {
        title: {
          type: 'string',
          enum: ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'],
        },
      },
    },
    uiSchema: updateScopeOfUISchemaElement('#', '#/properties/horizontalTest', {
      type: 'HorizontalLayout',
      //@ts-ignore
      elements: [
        {
          type: 'Control',
          scope: '#/properties/title',
        },
      ],
    }),
  },
]
