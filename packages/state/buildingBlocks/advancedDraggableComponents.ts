import { updateScopeOfUISchemaElement } from '@formswizard/utils'
import { DraggableComponent } from '@formswizard/types'
export const advancedDraggableComponents: DraggableComponent[] = [
  {
    name: 'person',
    ToolIconName: 'Person',
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
    name: "address",
    ToolIconName: "ContactMail",
    jsonSchemaElement: {
      "type": "object",
      "properties": {
        "street": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "postalCode": {
          "type": "string"
        },
        "country": {
          "type": "string",
          "enum": ["DE", "FR", "UK","UA","NE"]
        }
      }
    },
    "uiSchema": updateScopeOfUISchemaElement('#', '#/properties/address', {
      type: 'Group',
      //@ts-ignore
      label: 'Addresse',
      "elements": [
        {
          "type": "VerticalLayout",
          "elements": [
            {
              "type": "Control",
              "scope": "#/properties/street"
            },
            {
              "type": "Control",
              "scope": "#/properties/city"
            },
            {
              "type": "Control",
              "scope": "#/properties/postalCode"
            },
            {
              "type": "Control",
              "scope": "#/properties/country",
              
            }
          ]
        },
      ]
    })
  },



  {
    "name": "satisfactionRating",
    "ToolIconName": "Rating",
    "jsonSchemaElement": {
      "type": "object",
      "properties": {
        "aspect": {
          "type": "string"
        },
        "rating": {
          "type": "integer",
          "minimum": 1,
          "maximum": 5
        }
      }
    },
    "uiSchema": updateScopeOfUISchemaElement('#', '#/properties/satisfactionRating', {
      "type": "Group",
      //@ts-ignore
      "label": "Satisfaction Rating",
      "elements": [
        {
          "type": "HorizontalLayout",
          "elements": [
            {
              "type": "Control",
              "scope": "#/properties/aspect",
              "label": "Aspect"
            },
            {
              "type": "Control",
              "scope": "#/properties/rating",
              "label": "Rating",
              "options": {
                "slider": true
              }
            }
          ]
        }
      ]
    })
  }
  


]
