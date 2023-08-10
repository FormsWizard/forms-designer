import {DraggableComponent} from "@formswizard/state";
import {Person} from "@mui/icons-material";
import {updateScopeOfUISchemaElement} from "@formswizard/utils";

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
    label: 'horizontal Layout mit einem Element',
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
