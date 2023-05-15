import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { JsonSchema, Scopable, UISchemaElement } from '@jsonforms/core'
import { RootState } from '../../app/store'
import {
  insertUISchemaAfterScope,
  pathSegmentsToJSONPointer,
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
import { find } from 'lodash'
import jsonpointer from 'jsonpointer'

export type DraggableComponent = {
  name: string
  jsonSchemaElement: JsonSchema
  uiSchema?: UISchemaElement
}

export type DraggableUISchemaElement = {
  uiSchema: UISchemaElement
}

export const isDraggableComponent = (element: any): element is DraggableComponent =>
  element.name && element.jsonSchemaElement
export const isDraggableUISchemaElement = (element: any): element is DraggableUISchemaElement => element.uiSchema
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

export const getParentUISchemaElements: (
  uiSchemaPath: string,
  uiSchema: UISchemaElement
) => UISchemaElement[] | undefined = (uiSchemaPath, uiSchema) => {
  const pathSegments = pathToPathSegments(uiSchemaPath)
  if (pathSegments.length < 2) {
    return undefined
  }
  const parentPathSegments = pathSegments.slice(0, pathSegments.length - 1)
  return jsonpointer.get(uiSchema, pathSegmentsToJSONPointer(parentPathSegments))
}

export const findScopeWithinUISchemaElement: (
  uiSchemaPath: string,
  uiSchema: UISchemaElement,
  forward?: boolean
) => { scope: string; offset: number; path: string } | undefined = (uiSchemaPath, uiSchema, forward) => {
  const pathSegments = pathToPathSegments(uiSchemaPath)
  if (pathSegments.length < 2) {
    throw new Error('Invalid path, path should lead to an element part of an array, thus be at least 2 segments long')
  }
  const parentPathSegments = pathSegments.slice(0, pathSegments.length - 1)
  const index = parseInt(pathSegments[pathSegments.length - 1])
  if (isNaN(index)) {
    throw new Error('Invalid path, path should lead to an element part of an array')
  }
  const elements = jsonpointer.get(uiSchema, pathSegmentsToJSONPointer(parentPathSegments))
  if (!Array.isArray(elements)) {
    throw new Error('parent is not an array')
  }

  const test = forward ? (i: number) => i < elements.length : (i: number) => i >= 0,
    incrementor = forward ? 1 : -1
  for (let i = index; test(i); i += incrementor) {
    const scope: string | undefined = (elements[i] as Scopable).scope
    if (scope) {
      return {
        scope,
        offset: i - index,
        path: pathSegmentsToPath([...parentPathSegments, i.toString()]),
      }
    }
  }
  //if we reach this point, we didn't find a scope in the array, so we look in the parent
  if (parentPathSegments.length >= 2) {
    const parentElementPath = pathSegmentsToPath(parentPathSegments.slice(0, parentPathSegments.length - 1))
    return findScopeWithinUISchemaElement(parentElementPath, uiSchema, forward)
  }
  return undefined
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

const getIndexAndParentPathOfUISchemaElement: (uiSchemaPath: string) => {
  index: number | undefined
  parentPath: string | undefined
} = (uiSchemaPath) => {
  const pathSegments = pathToPathSegments(uiSchemaPath)
  if (pathSegments.length < 2) {
    return {
      index: undefined,
      parentPath: undefined,
    }
  }
  const parentPathSegments = pathSegments.slice(0, pathSegments.length - 1)
  const index = parseInt(pathSegments[pathSegments.length - 1])
  return {
    index: isNaN(index) ? undefined : index,
    parentPath: pathSegmentsToPath(parentPathSegments),
  }
}

const prepareRemoveLayoutFromUISchema: (
  uiSchema: UISchemaElement,
  uiSchemaPath: string
) => { pointer: string; elements: UISchemaElement[] } = (uiSchema, uiSchemaPath) => {
  const { index, parentPath } = getIndexAndParentPathOfUISchemaElement(uiSchemaPath)
  if (!index || !parentPath) {
    throw new Error('Invalid path, path should lead to an element part of an array, thus be at least 2 segments long')
  }
  const pointer = pathSegmentsToJSONPointer(pathToPathSegments(parentPath))
  const oldUISchema = jsonpointer.get(uiSchema, pointer)
  if (!Array.isArray(oldUISchema)) {
    throw new Error('UISchema Elements bucket is not an array')
  }

  return {
    pointer,
    elements: [...oldUISchema.slice(0, index), ...oldUISchema.slice(index + 1)],
  }
}

export const jsonFormsEditSlice = createSlice({
  name: 'jsonFormEdit',
  initialState: exampleInitialState1,
  reducers: {
    selectElement: (state: JsonFormsEditState, action: PayloadAction<string | undefined>) => {
      state.selectedElementKey = action.payload
    },
    removeLayout: (state: JsonFormsEditState, action: PayloadAction<{ uiSchemaPath: string }>) => {
      const { uiSchemaPath } = action.payload
      try {
        const { pointer, elements } = prepareRemoveLayoutFromUISchema(state.uiSchema, uiSchemaPath)
        jsonpointer.set(state.uiSchema, pointer, elements)
      } catch (e) {
        console.error(e)
      }
    },
    removeField: (state: JsonFormsEditState, action: PayloadAction<{ path: string }>) => {
      const { path } = action.payload
      state.jsonSchema = deeplyRemoveNestedProperty(state.jsonSchema, path)
    },
    removeFieldAndLayout: (state: JsonFormsEditState, action: PayloadAction<{ path: string }>) => {
      //TODO: handle removing key-value pair from data produced by the form in the current session
      // does work for me in the current version of the app
      const { path } = action.payload
      state.jsonSchema = deeplyRemoveNestedProperty(state.jsonSchema, path)
      if (state.uiSchema?.elements) {
        const scope = pathSegmentsToScope(pathToPathSegments(path))
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
    /**
     * different insert strategy, that does use the path of the uiSchemaElement
     *
     * the path is used to find the parent element in the uiSchema
     * the new element is inserted at the index of the parent element
     * to detect the jsonschema path findScope will search backwards in the uiSchema
     * for a scope, if it doesn't find a scope it searches forward, otherwise it will
     * use the root scope
     *
     *
     * @param state
     * @param action
     */
    insertControl: (
      state: JsonFormsEditState,
      action: PayloadAction<{
        index: number
        schema: JsonSchema
        child: UISchemaElement
        path?: string
        draggableMeta: DraggableComponent | DraggableUISchemaElement
        remove?: {
          fieldPath?: string
          layoutPath?: string
        }
      }>
    ) => {
      const { child, draggableMeta, remove } = action.payload
      const { uiSchema } = draggableMeta
      const path = (child as any).path as string

      const pathSegments = pathToPathSegments(path)
      const oldUISchemaElements = getParentUISchemaElements(path, state.uiSchema)
      const elementsPathSegment = pathSegments.slice(0, pathSegments.length - 1)
      const elementsPointer = pathSegmentsToJSONPointer(elementsPathSegment)
      const elIndex = parseInt(pathSegments[pathSegments.length - 1])
      if (isNaN(elIndex)) {
        console.error('cannot get the index of the current ui element, dropped on, the path is', path)
        return
      }

      if (!isDraggableComponent(draggableMeta) && isDraggableUISchemaElement(draggableMeta)) {
        const newUISchemaElements = [
          ...oldUISchemaElements.slice(0, elIndex + 1),
          uiSchema,
          ...oldUISchemaElements.slice(elIndex + 1),
        ]
        jsonpointer.set(state.uiSchema, elementsPointer, newUISchemaElements)
      } else if (isDraggableComponent(draggableMeta)) {
        let scope: string | undefined = '#/properties'
        if (pathSegments.length >= 2) {
          scope = findScopeWithinUISchemaElement(path, state.uiSchema, false)?.scope
          if (!scope) {
            scope = findScopeWithinUISchemaElement(path, state.uiSchema, true)?.scope
          }
        }

        const scopePathSegments = scopeToPathSegments(scope)
        const strippedPath =
          scopePathSegments.length > 0 ? scopePathSegments.slice(0, scopePathSegments.length - 1) : []
        const properties = strippedPath.reduce((acc, pathSegment) => {
          return acc[pathSegment].properties
        }, state.jsonSchema.properties)

        if (remove?.fieldPath) {
          state.jsonSchema = deeplyRemoveNestedProperty(state.jsonSchema, remove.fieldPath)
        }
        const { name, jsonSchemaElement } = draggableMeta
        let newKey = name
        for (let i = 1; properties[newKey] !== undefined; i++) {
          newKey = `${name}_${i}`
        }
        state.jsonSchema = deeplySetNestedProperty(state.jsonSchema, strippedPath, newKey, jsonSchemaElement)
        const newScope = pathSegmentsToScope([...strippedPath, newKey])
        state.selectedElementKey = newScope

        let newSchema: UISchemaElement & Scopable = uiSchema
        const newPath = [...strippedPath, newKey]
        //FIXME the following looks incorrect in some cases please review or rewrite (needs unit tests)
        newSchema =
          uiSchema && uiSchema?.type !== 'Control'
            ? updateScopeOfUISchemaElement(`#/properties/${newKey}`, pathSegmentsToScope(newPath), uiSchema)
            : {
                ...(uiSchema || {}),
                type: 'Control',
                scope: pathSegmentsToScope([...strippedPath, newKey]),
              }
        const newUISchemaElements = [
          ...oldUISchemaElements.slice(0, elIndex + 1),
          newSchema,
          ...oldUISchemaElements.slice(elIndex + 1),
        ]
        jsonpointer.set(state.uiSchema, elementsPointer, newUISchemaElements)
      }

      if (remove?.layoutPath) {
        /**
         * FIXME: correct remove.layoutPath in case the layout path is affected by the insert operation
         * remove does not work because the path is being altered
         * by the insert operation, thus remove path might be invalid
         * we have to compare the old and the new path and modify the path to be removed accordingly
         */
        let pathToRemove = remove.layoutPath
        const removePathSegments = pathToPathSegments(pathToRemove)
        //const removePathParent = removePathSegments.slice(0, removePathSegments.length - 1)
        if (pathToRemove.startsWith(pathSegmentsToPath(elementsPathSegment))) {
          const removePathIndex = parseInt(removePathSegments[removePathSegments.length - 1])
          if (isNaN(removePathIndex)) {
            console.error('cannot get the index of the current ui element, dropped on, the path is', pathToRemove)
            return
          }
          if (removePathIndex >= elIndex) {
            console.log('the path to remove is affected by the insert operation, we have to correct the path to remove')
            const pathToRemoveSegments = pathToPathSegments(pathToRemove)
            const segmentsLength = elementsPathSegment.length
            const tempIndex = parseInt(pathToRemoveSegments[segmentsLength])
            pathToRemove = pathSegmentsToPath([
              ...pathToRemoveSegments.slice(0, segmentsLength),
              (tempIndex + 1).toString(),
              ...pathToRemoveSegments.slice(segmentsLength + 1),
            ])
          }
          try {
            const { pointer, elements } = prepareRemoveLayoutFromUISchema(state.uiSchema, pathToRemove)
            console.log('removing layout element from ui schema', pointer, elements, pathToRemove)
            jsonpointer.set(state.uiSchema, pointer, elements)
          } catch (e) {
            console.error('error removing layout element from ui schema', e)
          }
        }
      }
    },
    toggleEditMode: (state: JsonFormsEditState) => {
      state.editMode = !state.editMode
    },
  },
})

export const {
  insertControl,
  selectElement,
  renameField,
  removeFieldAndLayout,
  removeField,
  removeLayout,
  updateUISchemaByScope,
  toggleEditMode,
} = jsonFormsEditSlice.actions

export default jsonFormsEditSlice.reducer
