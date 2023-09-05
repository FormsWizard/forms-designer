import { DraggableComponent, DraggableElement } from '../wizard/WizardSlice'
import { updateScopeOfUISchemaElement } from '../../utils/uiSchemaHelpers'
import {
  Person,
  TextFields,
  DateRange,
  CheckBox,
  ShortText,
  RadioButtonChecked,
  Tab,
  EditAttributes,
  ArrowRightAlt,
  Label,
  ArrowDownward,
  Info,
} from '@mui/icons-material'
export const basicDraggableComponents: DraggableElement[] = [
  {
    name: 'Label',
    ToolIcon: Label,
    jsonSchemaElement: {},
    uiSchema: {
      type: 'Label',
      //@ts-ignore
      text: 'Some Text',
    },
  },

  {
    name: 'Alert',
    ToolIcon: Info,
    jsonSchemaElement: {},
    uiSchema: {
      type: 'Alert',
      //@ts-ignore
      text: 'lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet',
    },
  },
  {
    name: 'Textfeld',
    ToolIcon: TextFields,
    jsonSchemaElement: {
      type: 'string',
    },
  },
  {
    name: 'Mehrzeiliges Textfeld',
    ToolIcon: ShortText,
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
    name: 'Checkbox',
    ToolIcon: CheckBox,
    jsonSchemaElement: {
      type: 'boolean',
    },
  },

  {
    name: 'Radio Buttons',
    ToolIcon: RadioButtonChecked,
    jsonSchemaElement: {
      type: 'string',
      enum: ['One', 'Two', 'Three'],
    },
    uiSchema: {
      type: 'Control',
      options: {
        format: 'default',
      },
    },
  },
  {
    name: 'Multiselect',
    ToolIcon: EditAttributes,
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
    name: 'Datumsfeld',
    ToolIcon: DateRange,
    jsonSchemaElement: {
      type: 'string',
      format: 'date',
    },
  },
  {
    name: 'Datumszeitfeld',
    ToolIcon: DateRange,
    jsonSchemaElement: {
      type: 'string',
      format: 'date-time',
    },
  },

  {
    name: 'List of Objects',
    ToolIcon: EditAttributes,
    jsonSchemaElement: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
    uiSchema: {
      type: 'Control',

      options: {
        showSortButtons: true,
      },
    },
  },
  {
    name: 'gruppe',
    ToolIcon: Tab,
    jsonSchemaElement: {
      type: 'object',
      properties: {},
    },
    uiSchema: updateScopeOfUISchemaElement('#', '#/properties/gruppe', {
      type: 'Group',
      //@ts-ignore
      label: 'Gruppe',
      elements: [
        {
          type: 'VerticalLayout',
          elements: [],
        },
      ],
    }),
  },
  {
    name: 'horizontales layout',
    ToolIcon: ArrowRightAlt,
    uiSchema: {
      type: 'HorizontalLayout',
      //@ts-ignore
      elements: [],
    },
  },
  {
    name: 'vertikales layout',
    ToolIcon: ArrowDownward,
    uiSchema: {
      type: 'HorizontalLayout',
      //@ts-ignore
      label: 'Vertikales Layout',
      elements: [],
    },
  },
]

export const advancedDraggableComponents: DraggableComponent[] = [
  {
    name: 'person',
    ToolIcon: Person,
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

  // {
  //   name: 'horizontalTest',
  //   //@ts-ignore
  //   label: 'horizontal layout mit einem Element',
  //   jsonSchemaElement: {
  //     type: 'object',

  //     properties: {
  //       title: {
  //         type: 'string',
  //         enum: ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'],
  //       },
  //     },
  //   },
  //   uiSchema: updateScopeOfUISchemaElement('#', '#/properties/horizontalTest', {
  //     type: 'HorizontalLayout',
  //     //@ts-ignore
  //     elements: [
  //       {
  //         type: 'Control',
  //         scope: '#/properties/title',
  //       },
  //     ],
  //   }),
  // },
]
