import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {JsonSchema, UISchemaElement, isLayout} from "@jsonforms/core";
import {RootState} from "../../app/store";
import isEmpty from "lodash/isEmpty";

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

export const recursivelyMapSchema = (
    uischema: UISchemaElement,
    toApply: (uischema: UISchemaElement) => (UISchemaElement | undefined)
): UISchemaElement | undefined => {
  if (isEmpty(uischema)) {
    return undefined;
  }
  if (isLayout(uischema)) {
    return toApply( {
      ...uischema,
      elements: uischema.elements.map(child => recursivelyMapSchema(child, toApply))
    } as UISchemaElement)
  }
  return toApply(uischema);
};

const insertAfterScope = (scope: string, newSchema: UISchemaElement, uiSchema: UISchemaElement) => {
  return recursivelyMapSchema(uiSchema, (uischema) => {
    //@ts-ignore
    if (isLayout(uischema) &&  uischema.elements.findIndex((el) => el.scope === scope) >= 0) {
      // insert newElement after the element with scope
      const newElements = uischema.elements.reduce((acc, el) => {
        //@ts-ignore
        if (el.scope === scope) {
          return [...acc, el, newSchema]
        }
        return [...acc, el]
      }, [])
      return {
        ...uischema,
        elements: newElements
      } as UISchemaElement
    }
    return uischema
  })
}
const deeplyInsertNestedProperty = (schema: JsonSchema, path: string[], newKey: string, newProperty: JsonSchema) => {
  if (path.length === 1) {
    return {
      ...schema,
      properties: {
        ...schema.properties,
        [newKey]: newProperty
      }
    }
  }
  const [first, ...rest] = path
  return deeplyInsertNestedProperty(schema.properties[first], rest, newKey, newProperty)
}

export const jsonFormsEditSlice = createSlice({
  name: 'jsonFormEdit',
  initialState,
  reducers: {
    insertControl: (state: JsonFormsEditState, action: PayloadAction<{ index: number, schema: JsonSchema, child: UISchemaElement, path?: string, draggableMeta: DraggableComponent }>) => {
      const {index, path, draggableMeta} = action.payload
      const {name, jsonSchemaElement, uiSchema} = draggableMeta
      const newIndex = index + 1
      console.log(action.payload)

      //TODO: detect if next to/above layout, where path is undefined => where to insert???

      let newKey = `${name}_${newIndex}`
      //TODO: subpath for nested elements
      const pathSegments = path?.split('.') || []
      if(pathSegments.length === 0) {
        return
      }
      const withoutLast = pathSegments.slice(0, pathSegments.length - 1)
      /*const properties =  withoutLast.reduce((acc, pathSegment) => {
        return acc[pathSegment].properties
      }, state.jsonSchema.properties)*/
      const properties = state.jsonSchema.properties
      for (let i = 1; properties[newKey] !== undefined; i++) {
        newKey = `${name}_${newIndex + i}`
      }
      state.jsonSchema.properties[newKey] = jsonSchemaElement
      //state.jsonSchema = deeplyInsertNestedProperty(state.jsonSchema, withoutLast, newKey, jsonSchemaElement)

      const newSchema = {
        ...(uiSchema || {}),
        type: "Control",
        scope: `#/properties/${newKey}`
      }
      if (state.uiSchema?.elements) {
        const scope = `#/properties/${pathSegments.join('/properties/')}`
        const newUISchema = insertAfterScope(scope, newSchema, state.uiSchema)
        state.uiSchema = newUISchema
      }
    }

  }
})

export const {insertControl} = jsonFormsEditSlice.actions

export default jsonFormsEditSlice.reducer
