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
      address: {
        type: 'object',
        properties: {
          created: {
            type: 'string',
            format: 'date-time',
          },
          street: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
          zip: {
            type: 'string',
            pattern: '[0-9]{5}',
          },
          country: {
            type: 'string',
            enum: ['Germany', 'France', 'UK', 'USA', 'Italy', 'Spain'],
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
        label: 'Address',
        elements: [
          {
            type: 'VerticalLayout',
            elements: [
              {
                type: 'Control',
                scope: '#/properties/address/properties/created',
              },
              {
                type: 'Control',
                scope: '#/properties/address/properties/street',
              },
              {
                type: 'Control',
                scope: '#/properties/address/properties/city',
              },
              {
                type: 'Control',
                scope: '#/properties/address/properties/zip',
              },
              {
                type: 'Control',
                scope: '#/properties/address/properties/country',
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
    properties: {},
  },
  uiSchema: { type: 'VerticalLayout', elements: [] },
}
