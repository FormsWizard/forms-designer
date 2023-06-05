import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { JsonSchema, Scopable, UISchemaElement } from '@jsonforms/core'
import { RootState } from '../../app/store'
import {
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
  deeplyUpdateNestedSchema,
} from '../../utils/jsonSchemaHelpers'
import { ScopableUISchemaElement } from '../../types'
import { exampleInitialState1, exampleInitialState2, JsonFormsEditState } from './exampleState'
import jsonpointer from 'jsonpointer'
import { OverridableComponent } from '@mui/material/OverridableComponent'

export type DraggableComponent = {
  name: string
  jsonSchemaElement: JsonSchema
  uiSchema?: UISchemaElement
  ToolIcon?: OverridableComponent<any>
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
//TODO: document further
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
  if (index === undefined || !parentPath) {
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
  initialState: exampleInitialState2,
  reducers: {
    selectElement: (state: JsonFormsEditState, action: PayloadAction<string | undefined>) => {
      state.selectedElementKey = action.payload
    },
    loadTemplate: (state: JsonFormsEditState, action: any) => {
      const templateData = action.payload
      const { jsonSchema, uiSchema } = templateData.Template
      if (!jsonSchema || !uiSchema) {
        return
      }
      state.selectedElementKey = null
      state.editMode = false
      state.jsonSchema = jsonSchema
      state.uiSchema = uiSchema
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
    updateJsonSchemaByPath: (
      state: JsonFormsEditState,
      action: PayloadAction<{ path: string; updatedSchema: any; updatedUIschema: any }>
    ) => {
      //TODO: handle removing key-value pair from data produced by the form in the current session
      // does work for me in the current version of the app
      const { path, updatedSchema, updatedUIschema } = action.payload
      const pathSegments = pathToPathSegments(path)
      const scope = pathSegmentsToScope(pathSegments)
      state.jsonSchema = deeplyUpdateNestedSchema(state.jsonSchema, pathSegments, updatedSchema)
      state.uiSchema = updateUISchemaElement(scope, updatedUIschema, state.uiSchema)
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
        child: UISchemaElement
        path?: string
        draggableMeta: DraggableComponent | DraggableUISchemaElement
        remove?: {
          fieldPath?: string
          layoutPath?: string
        }
      }>
    ) => {
      const { child, draggableMeta, remove } = action.payload,
        { uiSchema } = draggableMeta,
        path = (child as any).path as string,
        pathSegments = pathToPathSegments(path),
        oldUISchemaElements = getParentUISchemaElements(path, state.uiSchema),
        elementsPathSegment = pathSegments.slice(0, pathSegments.length - 1),
        elementsPointer = pathSegmentsToJSONPointer(elementsPathSegment),
        elIndex = parseInt(pathSegments[pathSegments.length - 1])
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
        /**
         * we need to find the new scope, by looking at the path of the uiSchemaElement
         * and then find the corresponding scope in the jsonSchema
         */
        let scope: string | undefined = '#/properties' //root scope
        if (pathSegments.length >= 2) {
          scope = findScopeWithinUISchemaElement(path, state.uiSchema, false)?.scope
          if (!scope) {
            scope = findScopeWithinUISchemaElement(path, state.uiSchema, true)?.scope
          }
        }
        if (remove?.fieldPath) {
          // we need to remove the field from the json schema, otherwise the field will be added twice
          state.jsonSchema = deeplyRemoveNestedProperty(state.jsonSchema, remove.fieldPath)
        }

        const scopePathSegments = scopeToPathSegments(scope),
          parentScopePathSegments =
            scopePathSegments.length > 0 ? scopePathSegments.slice(0, scopePathSegments.length - 1) : [],
          properties = parentScopePathSegments.reduce(
            (acc, pathSegment) => acc[pathSegment].properties,
            state.jsonSchema.properties
          )

        const { name, jsonSchemaElement } = draggableMeta
        let newKey = name
        for (let i = 1; properties[newKey] !== undefined; i++) {
          newKey = `${name}_${i}`
        }
        state.jsonSchema = deeplySetNestedProperty(state.jsonSchema, parentScopePathSegments, newKey, jsonSchemaElement)
        state.selectedElementKey = pathSegmentsToScope([...parentScopePathSegments, newKey])

        const newPath = [...parentScopePathSegments, newKey]
        //FIXME the following looks incorrect in some cases please review or rewrite (needs unit tests)
        const newSchema: UISchemaElement & Scopable =
          uiSchema && uiSchema?.type !== 'Control'
            ? updateScopeOfUISchemaElement(
                `#/properties/${name}`, //this does only apply to newly created elements
                pathSegmentsToScope(newPath),
                uiSchema
              )
            : {
                ...(uiSchema || {}),
                type: 'Control',
                scope: pathSegmentsToScope([...parentScopePathSegments, newKey]),
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
        let layoutPathMarkedForRemoval = remove.layoutPath
        const removePathSegments = pathToPathSegments(layoutPathMarkedForRemoval)
        // if the path to remove is a parent of the path we are inserting the new element into
        // we have to correct the path to remove
        if (
          layoutPathMarkedForRemoval &&
          layoutPathMarkedForRemoval.startsWith(pathSegmentsToPath(elementsPathSegment))
        ) {
          const removePathIndex = parseInt(removePathSegments[removePathSegments.length - 1])
          if (isNaN(removePathIndex)) {
            console.error(
              'cannot get the index of the current ui element, dropped on, the path is',
              layoutPathMarkedForRemoval
            )
            return
          }
          // go through the path segments of the newly inserted element and check if the path to remove is affected
          // by the insert operation

          const newElementPathSegments = [...elementsPathSegment, elIndex.toString()]
          let mostCommonPathSegements = [],
            newIndex: number | undefined = undefined
          const pathToRemoveSegments = pathToPathSegments(layoutPathMarkedForRemoval),
            segmentsLength = newElementPathSegments.length
          let tempIndex = parseInt(pathToRemoveSegments[segmentsLength - 1])
          for (let i = 0; i < segmentsLength; i++) {
            if (pathToRemoveSegments[i] === newElementPathSegments[i]) {
              mostCommonPathSegements.push(pathToRemoveSegments[i])
            } else {
              newIndex = parseInt(newElementPathSegments[i])
              tempIndex = parseInt(pathToRemoveSegments[i])
              break
            }
          }
          if (newIndex === undefined) newIndex = parseInt(newElementPathSegments[segmentsLength - 1])
          if (tempIndex >= newIndex) {
            layoutPathMarkedForRemoval = pathSegmentsToPath([
              ...pathToRemoveSegments.slice(0, segmentsLength - 1),
              (tempIndex + 1).toString(),
              ...pathToRemoveSegments.slice(segmentsLength),
            ])
          }
        }
        try {
          const { pointer, elements } = prepareRemoveLayoutFromUISchema(state.uiSchema, layoutPathMarkedForRemoval)
          jsonpointer.set(state.uiSchema, pointer, elements)
        } catch (e) {
          console.error('error removing layout element from ui schema', e)
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
  updateJsonSchemaByPath,
  loadTemplate,
} = jsonFormsEditSlice.actions

export default jsonFormsEditSlice.reducer
