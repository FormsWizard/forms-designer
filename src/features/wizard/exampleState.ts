import { JsonSchema, Scopable, UISchemaElement } from '@jsonforms/core'
export type JsonFormsEditState = {
  jsonSchema: JsonSchema
  uiSchema?: any
  selectedElementKey?: string
  editMode: boolean
}

export const exampleInitialState1: JsonFormsEditState = {
  editMode: false,
  jsonSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      done: {
        type: 'boolean',
      },
      rating: {
        type: 'integer',
      },
      customerSatisfaction: {
        type: 'integer',
      },
      category: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
        },
      },
      meta: {
        type: 'object',
        properties: {
          created: {
            type: 'string',
            format: 'date-time',
          },
          lastModified: {
            type: 'string',
            format: 'date-time',
          },
          version: {
            type: 'integer',
          },
        },
      },
    },
    required: ['name'],
  },
  uiSchema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/name',
      },
      {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/rating',
          },
          {
            type: 'Control',
            scope: '#/properties/customerSatisfaction',
          },
        ],
      },
      {
        type: 'Control',
        scope: '#/properties/category/properties/name',
      },
      {
        type: 'Control',
        scope: '#/properties/category/properties/description',
      },
      {
        type: 'Control',
        scope: '#/properties/description',
      },
      {
        type: 'Control',
        scope: '#/properties/done',
      },
      {
        type: 'Group',
        label: 'Metadata',
        elements: [
          {
            type: 'VerticalLayout',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/meta/properties/created',
              },
              {
                type: 'Control',
                scope: '#/properties/meta/properties/lastModified',
              },
              {
                type: 'Control',
                scope: '#/properties/meta/properties/version',
              },
            ],
          },
        ],
      },
    ],
  },
}

export const exampleInitialState2: JsonFormsEditState = {
  editMode: false,
  jsonSchema: {
    type: 'object',
    properties: {
      Radio: {
        type: 'string',
        enum: ['One', 'Two', 'Three'],
      },
      HorizontalLayout: {
        type: 'object',
      },
    },
  },
  uiSchema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/Radio',
        label: 'Radio Buttons mit langem Label',
        options: {
          format: 'radio',
          multi: true,
        },
      },
      {
        type: 'HorizontalLayout',
        scope: '#/properties/HorizontalLayout',
        elements: [],
      },
    ],
  },
}
