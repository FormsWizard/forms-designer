import { updateScopeOfUISchemaElement } from '@formswizard/utils'
import { DraggableElement } from '@formswizard/types'

export const basicDraggableComponents: DraggableElement[] = [
  {
    name: 'Label',
    ToolIconName: 'Label',
    jsonSchemaElement: {},
    uiSchema: {
      type: 'Label',
      //@ts-ignore
      text: 'Some Text',
    },
  },

  {
    name: 'Alert',
    ToolIconName: 'Info',
    jsonSchemaElement: {},
    uiSchema: {
      type: 'Alert',
      //@ts-ignore
      text: 'lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet',
    },
  },
  {
    name: 'Textfeld',
    ToolIconName: 'TextFields',
    jsonSchemaElement: {
      type: 'string',
    },
  },
  {
    name: 'Number',
    ToolIconName: 'Numbers', 
    jsonSchemaElement: {
      type: 'integer',
    },
  },

  {
    name: 'Datumsfeld',
    ToolIconName: 'DateRange',
    jsonSchemaElement: {
      type: 'string',
      format: 'date',
    },
  },
  {
    name: 'Datumszeitfeld',
    ToolIconName: 'DateRange',
    jsonSchemaElement: {
      type: 'string',
      format: 'date-time',
    },
  },
  {
    name: 'Checkbox',
    ToolIconName: 'CheckBox',
    jsonSchemaElement: {
      type: 'boolean',
    },
  },
  {
    name: 'Mehrzeiliges Textfeld',
    ToolIconName: 'ShortText',
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
    ToolIconName: 'RadioButtonChecked',
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
    ToolIconName: 'EditAttributes',
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
    name: 'List of Objects',
    ToolIconName: 'EditAttributes',
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
    name: 'horizontales layout',
    ToolIconName: 'ArrowRightAlt',
    uiSchema: {
      type: 'HorizontalLayout',
      //@ts-ignore
      elements: [],
    },
  },
  {
    name: 'vertikales layout',
    ToolIconName: 'ArrowDownward',
    uiSchema: {
      type: 'VerticalLayout',
      //@ts-ignore
      label: 'Vertikales Layout',
      elements: [],
    },
  },

  {
    name: 'gruppe',
    ToolIconName: 'Tab',
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
]
