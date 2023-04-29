import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { JsonSchema, Scopable, UISchemaElement } from '@jsonforms/core'
import { RootState } from '../../app/store'
import {
  insertUISchemaAfterScope,
  pathSegmentsToPath,
  pathSegmentsToScope,
  pathToPathSegments,
  recursivelyMapSchema,
  removeUISchemaElement,
  scopeToPathSegments,
  updateScopeOfUISchemaElement,
  updateUISchemaElement,
} from '../../utils/uiSchemaHelpers'
import {
  deeplyRemoveNestedProperty,
  deeplyRenameNestedProperty,
  deeplySetNestedProperty,
} from '../../utils/jsonSchemaHelpers'
import { ScopableUISchemaElement } from '../../types'
import { exampleInitialState1, exampleInitialState2, JsonFormsEditState } from './exampleState'

export type DraggableComponent = {
  name: string
  jsonSchemaElement: JsonSchema
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
  const scope = pathSegmentsToScope(pathSegments)
  return selectUIElementByScope(state, scope)
}

export const selectUIElementFromSelection = (state: RootState) => {
  const selectedElementKey = selectSelectedElementKey(state)
  if (!selectedElementKey || selectedElementKey.startsWith('layout')) {
    return undefined
  }
  return selectUIElementByPath(state, selectedElementKey)
}

export const selectEditMode = (state: RootState) => state.jsonFormsEdit.editMode

export const findPreviousScope: (
  index: number,
  elements: ScopableUISchemaElement[],
  skipScope?: string
) => { scope: string; offset: number } | undefined = (index, elements, skipScope) => {
  for (let i = index; i >= 0; i--) {
    if (elements[i]?.type === 'Control') {
      const scope = (elements[i] as Scopable).scope
      if (scope && scope !== skipScope) {
        return {
          scope,
          offset: index - i,
        }
      }
    }
  }
}

export const nextFreeKey: (
  name: string,
  pathSegments: string[],
  jsonSchema: JsonSchema
) => { path: string; key: string } = (name, pathSegments, jsonSchema) => {
  const strippedPath = pathSegments.length > 0 ? pathSegments.slice(0, pathSegments.length - 1) : []
  const properties = strippedPath.reduce((acc, pathSegment) => {
    return acc[pathSegment].properties
  }, jsonSchema.properties)

  let key = name
  for (let i = 1; properties[key] !== undefined; i++) {
    key = `${name}_${i}`
  }
  return {
    path: pathSegmentsToPath([...strippedPath, key]),
    key,
  }
}

export const jsonFormsEditSlice = createSlice({
  name: 'jsonFormEdit',
  initialState: exampleInitialState2,
  reducers: {
    selectElement: (state: JsonFormsEditState, action: PayloadAction<string | undefined>) => {
      state.selectedElementKey = action.payload
    },

    removeField: (state: JsonFormsEditState, action: PayloadAction<{ path: string }>) => {
      //TODO: handle removing key-value pair from data produced by the form in the current session
      // does work for me in the current version of the app
      const { path } = action.payload
      const pathSegments = path?.split('.') || []
      state.jsonSchema = deeplyRemoveNestedProperty(state.jsonSchema, pathSegments)
      if (state.uiSchema?.elements) {
        const scope = pathSegmentsToScope(pathSegments)
        state.uiSchema = removeUISchemaElement(scope, state.uiSchema)
      }
    },
    renameField: (state: JsonFormsEditState, action: PayloadAction<{ path: string; newFieldName: string }>) => {
      //TODO: handle renaming key within data produced by the form in the current session
      const { path, newFieldName } = action.payload
      if (newFieldName.includes('.')) {
        throw new Error('Field name cannot contain a dot')
      }
      const pathSegments = path?.split('.') || []
      state.jsonSchema = deeplyRenameNestedProperty(state.jsonSchema, pathSegments, newFieldName)
      if (state.uiSchema?.elements) {
        const strippedPath = pathSegments.length > 0 ? pathSegments.slice(0, pathSegments.length - 1) : []
        const newScope = pathSegmentsToScope([...strippedPath, newFieldName])
        const scope = pathSegmentsToScope(pathSegments)
        state.uiSchema = updateScopeOfUISchemaElement(scope, newScope, state.uiSchema)
      }
      //state.uiSchema = updateScopeOfUISchemaElement()
    },
    updateUISchemaByScope: (
      state: JsonFormsEditState,
      action: PayloadAction<{ scope: string; uiSchema: UISchemaElement }>
    ) => {
      const { scope, uiSchema } = action.payload
      state.uiSchema = updateUISchemaElement(scope, uiSchema, state.uiSchema)
    },
    insertControl: (
      state: JsonFormsEditState,
      action: PayloadAction<{
        index: number
        schema: JsonSchema
        child: UISchemaElement
        parent: UISchemaElement[]
        path?: string
        draggableMeta: DraggableComponent
      }>
    ) => {
      const { index, path, parent, draggableMeta } = action.payload
      const { name, jsonSchemaElement, uiSchema } = draggableMeta
      const newIndex = index + 1

      const isLayout = !path

      let pathSegments = [],
        _offset = 0
      if (isLayout) {
        //FIXME: inserting to/above layout still buggy
        const skipScope = pathSegmentsToScope(pathToPathSegments(draggableMeta.name))
        const { scope, offset } = findPreviousScope(index, parent, skipScope) || {}
        _offset = offset
        if (scope) pathSegments = scopeToPathSegments(scope)
      } else {
        pathSegments = path?.split('.') || []
      }
      if (pathSegments.length === 0) {
        console.warn('cannot insert into zero length path')
        return
      }
      const strippedPath = pathSegments.length > 0 ? pathSegments.slice(0, pathSegments.length - 1) : []
      const properties = strippedPath.reduce((acc, pathSegment) => {
        return acc[pathSegment].properties
      }, state.jsonSchema.properties)

      let newKey = name
      for (let i = 1; properties[newKey] !== undefined; i++) {
        newKey = `${name}_${newIndex + i}`
      }
      state.jsonSchema = deeplySetNestedProperty(state.jsonSchema, strippedPath, newKey, jsonSchemaElement)

      if (state.uiSchema?.elements) {
        const newPath = [...strippedPath, newKey]
        console.log(newPath)
        const newSchema =
          uiSchema && uiSchema?.type !== 'Control'
            ? updateScopeOfUISchemaElement(`#/properties/${newKey}`, pathSegmentsToScope(newPath), uiSchema)
            : {
                ...(uiSchema || {}),
                type: 'Control',
                scope: pathSegmentsToScope([...strippedPath, newKey]),
              }
        console.log(newSchema)
        const scope = pathSegmentsToScope(pathSegments)
        state.uiSchema = isLayout
          ? insertUISchemaAfterScope(scope, newSchema, state.uiSchema, index + _offset)
          : insertUISchemaAfterScope(scope, newSchema, state.uiSchema)
      }
    },
    toggleEditMode: (state: JsonFormsEditState) => {
      state.editMode = !state.editMode
    },
  },
})

export const { insertControl, selectElement, renameField, removeField, updateUISchemaByScope, toggleEditMode } =
  jsonFormsEditSlice.actions

export default jsonFormsEditSlice.reducer
