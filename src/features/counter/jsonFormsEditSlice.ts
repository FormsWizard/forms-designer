import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {RootState} from "../../app/store";
import {
  insertUISchemaAfterScope, pathToScope, recursivelyMapSchema,
  removeUISchemaElement,
  updateScopeOfUISchemaElement, updateUISchemaElement
} from "../../utils/uiSchemaHelpers";
import {
  deeplyRemoveNestedProperty,
  deeplyRenameNestedProperty,
  deeplySetNestedProperty
} from "../../utils/jsonSchemaHelpers";
import {ScopableUISchemaElement} from "../../types";

export type JsonFormsEditState = {
  jsonSchema: JsonSchema,
  uiSchema?: any
  selectedElementKey?: string
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

export const selectSelectedElementKey = (state: RootState) => state.jsonFormsEdit.selectedElementKey

export const selectUIElementByScope = (state: RootState, scope: string) => {
  const uiSchema = selectUiSchema(state)
  if (uiSchema?.elements) {
    //TODO: make this code cleaner by using a functional recursive finder
    let uiElement = undefined
    recursivelyMapSchema(uiSchema, (uischema: ScopableUISchemaElement) => {
      if (uischema.scope === scope) {
        uiElement = uischema
        return uischema as UISchemaElement
      }
    })
    return uiElement
  }
  return undefined
}
export const selectUIElementByPath = (state: RootState, path: string) => {
  const pathSegments = path?.split('.') || []
  const scope = pathToScope(pathSegments)
  return selectUIElementByScope(state, scope)
}

export  const selectUIElementFromSelection = (state: RootState) => {
  const selectedElementKey = selectSelectedElementKey(state)
  if(!selectedElementKey || selectedElementKey.startsWith('layout')) {
    return undefined
  }
  return selectUIElementByPath(state, selectedElementKey)
}

export const jsonFormsEditSlice = createSlice({
  name: 'jsonFormEdit',
  initialState,
  reducers: {
    selectElement: (state: JsonFormsEditState, action: PayloadAction<string | undefined>) => {
      state.selectedElementKey = action.payload === state.selectedElementKey ? undefined : action.payload
    },
    removeField: (state: JsonFormsEditState, action: PayloadAction<{ path: string }>) => {
      const {path} = action.payload
      const pathSegments = path?.split('.') || []
      state.jsonSchema = deeplyRemoveNestedProperty(state.jsonSchema, pathSegments)
      if (state.uiSchema?.elements) {
        const scope = pathToScope( pathSegments)
        state.uiSchema = removeUISchemaElement(scope, state.uiSchema)
      }
    },
    renameField: (state: JsonFormsEditState, action: PayloadAction<{ path: string, newFieldName: string }>) => {
      const {path, newFieldName} = action.payload
      const pathSegments = path?.split('.') || []
      state.jsonSchema = deeplyRenameNestedProperty(state.jsonSchema, pathSegments, newFieldName)
      if (state.uiSchema?.elements) {
        const strippedPath = pathSegments.length > 0 ? pathSegments.slice(0, pathSegments.length - 1) : []
        const newScope = pathToScope([...strippedPath, newFieldName])
        const scope = pathToScope(pathSegments)
        state.uiSchema = updateScopeOfUISchemaElement(scope, newScope, state.uiSchema)
      }
      //state.uiSchema = updateScopeOfUISchemaElement()
    },
    updateUISchemaByScope: (state: JsonFormsEditState, action: PayloadAction<{ scope: string, uiSchema: UISchemaElement }>) => {
      const {scope, uiSchema} = action.payload
      state.uiSchema = updateUISchemaElement(scope, uiSchema, state.uiSchema)
    },
    insertControl: (state: JsonFormsEditState, action: PayloadAction<{ index: number, schema: JsonSchema, child: UISchemaElement, path?: string, draggableMeta: DraggableComponent }>) => {
      const {index, path, draggableMeta} = action.payload
      const {name, jsonSchemaElement, uiSchema} = draggableMeta
      const newIndex = index + 1

      let newKey = `${name}_${newIndex}`
      const pathSegments = path?.split('.') || []
      if (pathSegments.length === 0) {
        //TODO: detect if next to/above layout, where path is undefined => where to insert???
        console.warn('path is empty, cannot insert element')
        return
      }
      const strippedPath = pathSegments.length > 0 ? pathSegments.slice(0, pathSegments.length - 1) : []
      const properties = strippedPath.reduce((acc, pathSegment) => {
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
          scope: pathToScope([...strippedPath, newKey])
        }
        const scope = pathToScope(pathSegments)
        const newUISchema = insertUISchemaAfterScope(scope, newSchema, state.uiSchema)
        state.uiSchema = newUISchema
      }
    }

  }
})

export const {insertControl, selectElement, renameField, removeField, updateUISchemaByScope} = jsonFormsEditSlice.actions

export default jsonFormsEditSlice.reducer
