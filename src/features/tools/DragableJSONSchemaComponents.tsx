import {DraggableComponent, DraggableElement} from '../wizard/WizardSlice'
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
  Label, ArrowDownward,
} from '@mui/icons-material'
export const basicDraggableComponents: DraggableElement[] = [
  {
    name: 'Label',
    ToolIcon: Label,
    jsonSchemaElement: {},
    uiSchema: {
      type: 'Control',
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
    name: 'horizontales layout',
    ToolIcon: ArrowRightAlt,
    uiSchema: {
      type: 'HorizontalLayout',
    },
  },
  {
    name: 'vertikales layout',
    ToolIcon: ArrowDownward,
    uiSchema: {
      type: 'HorizontalLayout',
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
          type: 'HorizontalLayout',
          elements: []
        }
      ],
    }),
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
