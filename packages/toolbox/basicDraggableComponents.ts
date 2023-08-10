import {DraggableElement} from "@formswizard/state";
import {
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
import {updateScopeOfUISchemaElement} from "@formswizard/utils";

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
    name: 'Checkbox',
    ToolIcon: CheckBox,
    jsonSchemaElement: {
      type: 'boolean',
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
    name: 'Radio Buttons',
    ToolIcon: RadioButtonChecked,
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
]
