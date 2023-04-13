import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {RootState} from "../../app/store";
import {insertUISchemaAfterScope} from "../../utils/uiSchemaHelpers";
import {deeplySetNestedProperty} from "../../utils/jsonSchemaHelpers";

export type JsonFormsEditState = {
  jsonSchema: JsonSchema,
  uiSchema?: any
}

const initialState: JsonFormsEditState = {
  jsonSchema: {
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "done": {
        "type": "boolean"
      },
      "rating": {
        "type": "integer"
      },
      "customerSatisfaction": {
        "type": "integer"
      },
      "category": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          }
        }
      },
      "meta": {
        "type": "object",
        "properties": {
          "created": {
            "type": "string",
            "format": "date-time"
          },
          "lastModified": {
            "type": "string",
            "format": "date-time"
          },
          "version": {
            "type": "integer"
          }
        }
      }
    },
    "required": [
      "name"
    ]
  },
  uiSchema:
      {
        "type": "VerticalLayout",
        "elements": [
          {
            "type": "Control",
            "scope": "#/properties/name"
          },
          {
            "type": "HorizontalLayout",
            "elements": [
              {
                "type": "Control",
                "scope": "#/properties/rating"
              },
              {
                "type": "Control",
                "scope": "#/properties/customerSatisfaction"
              }
            ]
          },
          {
            "type": "Control",
            "scope": "#/properties/category/properties/name"
          },
          {
            "type": "Control",
            "scope": "#/properties/category/properties/description"
          },
          {
            "type": "Control",
            "scope": "#/properties/description"
          }, {
            "type": "Control",
            "scope": "#/properties/done"
          },
          {
            "type": "Group",
            "label": "Metadata",
            "elements": [
              {
                "type": "VerticalLayout",
                "elements": [
                  {
                    "type": "Control",
                    "scope": "#/properties/meta/properties/created"
                  },
                  {
                    "type": "Control",
                    "scope": "#/properties/meta/properties/lastModified"
                  },
                  {
                    "type": "Control",
                    "scope": "#/properties/meta/properties/version"
                  }
                ]
              }
            ]
          }
        ]
      }
}

export type DraggableComponent = {
  name: string,
  jsonSchemaElement: JsonSchema,
  uiSchema?: UISchemaElement
}
export const selectJsonSchema = (state: RootState) => state.jsonFormsEdit.jsonSchema

export const selectUiSchema = (state: RootState) => state.jsonFormsEdit.uiSchema

export const jsonFormsEditSlice = createSlice({
  name: 'jsonFormEdit',
  initialState,
  reducers: {
    insertControl: (state: JsonFormsEditState, action: PayloadAction<{ index: number, schema: JsonSchema, child: UISchemaElement, path?: string, draggableMeta: DraggableComponent }>) => {
      const {index, path, draggableMeta} = action.payload
      const {name, jsonSchemaElement, uiSchema} = draggableMeta
      const newIndex = index + 1

      let newKey = `${name}_${newIndex}`
      const pathSegments = path?.split('.') || []
      if(pathSegments.length === 0) {
        //TODO: detect if next to/above layout, where path is undefined => where to insert???
        console.warn('path is empty, cannot insert element')
        return
      }
      const strippedPath = pathSegments.length > 0 ?  pathSegments.slice(0, pathSegments.length - 1) : []
      const properties =  strippedPath.reduce((acc, pathSegment) => {
        return acc[pathSegment].properties
      }, state.jsonSchema.properties)

      for (let i = 1; properties[newKey] !== undefined; i++) {
        newKey = `${name}_${newIndex + i}`
      }
      state.jsonSchema = deeplySetNestedProperty(state.jsonSchema, strippedPath, newKey, jsonSchemaElement)

      if (state.uiSchema?.elements) {
        const newSchema = {
          ...(uiSchema || {}),
          type: "Control",
          scope: `#/properties/${[...strippedPath,  newKey].join('/properties/')}`
        }
        const scope = `#/properties/${pathSegments.join('/properties/')}`
        const newUISchema = insertUISchemaAfterScope(scope, newSchema, state.uiSchema)
        state.uiSchema = newUISchema
      }
    }

  }
})

export const {insertControl} = jsonFormsEditSlice.actions

export default jsonFormsEditSlice.reducer
