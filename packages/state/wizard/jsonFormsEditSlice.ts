import { createSelector, createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { JsonSchema, Scopable, UISchemaElement } from '@jsonforms/core'
import { RootState } from '../store'
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
} from 'utils'
import {
  deeplyRemoveNestedProperty,
  deeplyRenameNestedProperty,
  deeplyUpdateNestedSchema,
} from 'utils'
import { ScopableUISchemaElement } from 'types'
import { exampleInitialState2, JsonFormsEditState } from './exampleState'
import jsonpointer from 'jsonpointer'
import { findLastIndex } from 'lodash'
import { collectSchemaGarbage } from 'utils'

export type DraggableMeta = {
  name: string
  ToolIcon?: any
}

export type DraggableComponent = DraggableMeta & {
  jsonSchemaElement: JsonSchema
  uiSchema?: UISchemaElement
}

export type DraggableUISchemaElement = DraggableMeta & {
  uiSchema: UISchemaElement
}

export type DraggableElement = DraggableComponent | DraggableUISchemaElement

export const isDraggableComponent = (element: any): element is DraggableComponent =>
  element.name && element.jsonSchemaElement
export const isDraggableUISchemaElement = (element: any): element is DraggableUISchemaElement => element.uiSchema
export const selectJsonSchema = (state: RootState) => state.jsonFormsEdit.jsonSchema

export const selectUiSchema = (state: RootState) => state.jsonFormsEdit.uiSchema

export const selectSelectedElementKey = (state: RootState) => state.jsonFormsEdit.selectedElementKey
//TODO: document further
export const selectUIElementByScope: (uiSchema: UISchemaElement, scope: string) => UISchemaElement | undefined = (uiSchema, scope) => {
  //TODO: make this code cleaner by using a functional recursive findestate.jsonSchema.propertiesr
  let uiElement = undefined
  recursivelyMapSchema(uiSchema, (uischema: ScopableUISchemaElement) => {
    if (uischema.scope === scope) {
      uiElement = uischema
      return uischema as UISchemaElement
    }
  })
  return uiElement
}
export const selectUIElementByPath = (uiSchema: UISchemaElement, path: string) => {
  const pathSegments = path?.split('.') || []
  const scope = pathSegmentsToScope(pathSegments)
  return selectUIElementByScope(uiSchema, scope)
}

export const selectUIElementFromSelection: (state: RootState) => UISchemaElement | undefined = createSelector(
  selectSelectedElementKey,
  selectUiSchema,
  (selectedElementKey, uiSchema) => {
    if (!selectedElementKey) return undefined
    // if type is layout name is actually an index
    if (selectedElementKey.includes('-')) {
      const [UiElementType, UiElementName] = selectedElementKey.split('-')
      return undefined
    }

    return selectUIElementByPath(uiSchema, selectedElementKey)
  }
)

// const selectUIElementByPath = createSelector([selectSelectedElementKey], (selectedElementKey) => {
//   if (!selectedElementKey || selectedElementKey.startsWith('layout')) {
//     return undefined
//   }
//   return selectUIElementByPath(state, selectedElementKey)
// })

export const getParentUISchemaElements: (
  uiSchemaPath: string,
  uiSchema: UISchemaElement
) => UISchemaElement[] | undefined = (uiSchemaPath, uiSchema) => {
  const pathSegments = pathToPathSegments(uiSchemaPath)
  if (pathSegments.length < 2) {
    return []
  }
  const parentPathSegments = pathSegments.slice(0, pathSegments.length - 1)
  return jsonpointer.get(uiSchema, pathSegmentsToJSONPointer(parentPathSegments)) || []
}
export const pathPointsToElements: (uiSchemaPath: string, uiSchema: UISchemaElement) => Boolean = (
  uiSchemaPath,
  uiSchema
) => {
  const pathSegments = pathToPathSegments(uiSchemaPath)
  const parentPathSegments = pathSegments.slice(0, pathSegments.length - 1)
  return Array.isArray(jsonpointer.get(uiSchema, pathSegmentsToJSONPointer(parentPathSegments)))
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

const getUiSchemaOfDraggable: (
  draggableComponent: DraggableComponent | DraggableUISchemaElement,
  newKey: string
) => UISchemaElement | undefined = (draggableComponent, newKey) => {
  const { name, uiSchema } = draggableComponent

  if (draggableComponent.uiSchema && uiSchema) {
    return updateScopeOfUISchemaElement(
      `#/properties/${name}`, //this does only apply to newly created elements
      pathSegmentsToScope([newKey]),
      uiSchema
    )
  } else {
    return {
      ...(uiSchema || {}),
      type: 'Control',
      scope: pathSegmentsToScope([newKey]),
    }
  }
}

const getUiSchemaWithFlatScope: (
  draggableComponent: DraggableComponent | DraggableUISchemaElement,
  deepestGroupPath: string[],
  newKey: string
) => UISchemaElement | undefined = (draggableComponent, deepestGroupPath, newKey) => {
  const { name, uiSchema } = draggableComponent

  return {
    type: 'Control',
    ...(uiSchema || {}),
    scope: pathSegmentsToScope([...deepestGroupPath, newKey]),
  }
}

const getDeepestGroupPath = (structurePath: string, uiSchema: any): string[] => {
  const structurePathSegments = pathToPathSegments(structurePath)
  const siblingRemoved = structurePathSegments.slice(0, structurePathSegments.length - 2)
  // const pathPairs = siblingRemoved.reduce((prev, curr, index, array) => {
  //   if (!isNaN(parseInt(curr))) return prev
  //   return [...prev, [curr, parseInt(array[index + 1])]]
  // }, [])
  const deepestGroupIndex = findLastIndex(siblingRemoved, (pair) => pair === 'Group')
  const deepestGroup = siblingRemoved.slice(0, deepestGroupIndex + 2)

  let schemaPath: string[] = []
  deepestGroup.reduce((prev, curr) => {
    let index = parseInt(curr)
    if (isNaN(index)) return prev
    let element = prev[index]
    if (element.type === 'Group' && element.label) {
      schemaPath.push(element.label)
    }
    if (element.elements) {
      return element.elements
    }
    return element
  }, uiSchema.elements)
  console.log(current(uiSchema))

  return schemaPath
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
      state.jsonSchema = jsonSchema
      state.uiSchema = uiSchema
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
    removeFieldOrLayout: (state: JsonFormsEditState, action: PayloadAction<{ componentMeta: DraggableComponent }>) => {
      // instead of using an abritrary path, we use the scope of the uiSchema element to remove the json schema part
      // and the path of the uiSchema element to remove the uiSchema part
      const { uiSchema } = action.payload.componentMeta
      const { path, scope } = uiSchema as any
      if (path) {
        state.uiSchema = removeUISchemaElement(scope, state.uiSchema)
      }
      if (scope) {
        state.jsonSchema = deeplyRemoveNestedProperty(state.jsonSchema, pathSegmentsToPath(scopeToPathSegments(scope)))
      }
      state.jsonSchema = collectSchemaGarbage(state.jsonSchema, state.uiSchema)
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
     *
     * the path is used to find the parent element in the uiSchema
     * the new element is inserted at the index of the parent element
     * to detect the jsonschema path findScope will search backwards in the uiSchema
     * for a scope, if it doesn't find a scope it searches forward, otherwise it will
     * use the root scope
     *
     * and optional uiSchemaPath can be provided to override the path used to find the parent element
     * this is needed for empty layouts
     *
     * @param state
     * @param action
     */

    insertControl: (
      state: JsonFormsEditState,
      action: PayloadAction<{
        child: UISchemaElement & { path?: string; structurePath?: string }
        isPlaceholder?: Boolean
        draggableMeta: DraggableComponent | DraggableUISchemaElement
        placeBefore?: Boolean
      }>
    ) => {
      const { child, draggableMeta, placeBefore = false, isPlaceholder = false } = action.payload
      const path = child.path === '' ? 'elements.0' : isPlaceholder ? child.path + '.elements.0' : child.path
      if(!path) {
        console.error('cannot insert control, no path provided')
        return
      }
      const pathSegments = pathToPathSegments(path),
        oldUISchemaElements = getParentUISchemaElements(path, state.uiSchema),
        // elementsPathSegment = pathSegments.slice(0, pathSegments.length - 1),
        elIndex = parseInt(pathSegments[pathSegments.length - 1]),
        targetIndex = elIndex + (placeBefore ? 0 : 1)
      if (isNaN(elIndex)) {
        console.error('cannot get the index of the current ui element, dropped on, the path is', path)
        return
      }

      // const properties = parentScopePathSegments.reduce(
      //   (acc, pathSegment) => acc[pathSegment].properties,
      //   state.jsonSchema.properties
      // )

      // get the name of the new element
      if(!state.jsonSchema.properties) {
        console.error('cannot insert control, no properties in json schema')
        return
      }
      let newKey = draggableMeta.name || 'newProperty'
      for (let i = 1; state.jsonSchema.properties[newKey] !== undefined; i++) {
        newKey = `${draggableMeta.name}_${i}`
      }
      let uiSchema = draggableMeta.uiSchema
      if (isDraggableComponent(draggableMeta)) {
        // TODO scope is not set correctly

        //   const deepestGroupPath = getDeepestGroupPath(child.structurePath, state.uiSchema)

        //   let schema = pathSegmentsToScope(deepestGroupPath)
        uiSchema = getUiSchemaWithFlatScope(draggableMeta, [], newKey)

        //   // // TODO add createsOwnScope to draggableMeta
        //   // if(draggableMeta.name === 'gruppe') {

        //   // }
        //   state.jsonSchema = deeplySetNestedProperty(
        //     state.jsonSchema,
        //     deepestGroupPath,
        //     newKey,
        //     draggableMeta.jsonSchemaElement,
        //     true
        //   )
        state.jsonSchema.properties[newKey] = draggableMeta.jsonSchemaElement
      }
      uiSchema && oldUISchemaElements?.splice(targetIndex, 0, uiSchema)
    },

    moveControl: (
      state: JsonFormsEditState,
      action: PayloadAction<{
        child: UISchemaElement & { path?: string; structurePath?: string }
        uiSchemaPath?: string
        draggableMeta: DraggableComponent | DraggableUISchemaElement
        placeBefore?: Boolean
      }>
    ) => {
      const { child, draggableMeta, placeBefore } = action.payload
      // this is tghe move target
      const { index= 0, parentPath } = getIndexAndParentPathOfUISchemaElement(child.path || '')
      // this is the move source
      const { path: sourcePath } = draggableMeta.uiSchema as any
      const { index: sourceIndex, parentPath: sourceParentPath } = getIndexAndParentPathOfUISchemaElement(sourcePath)

      if(!sourceIndex || !sourceParentPath) {
        throw new Error('source parent path is undefined')
      }

      const targetIndex = index + (placeBefore ? 0 : 1)
      // const sourceIndex = getIndexFromPath(sourcePath)

      if (index === undefined || !parentPath) {
        throw new Error(
          'Invalid path, path should lead to an element part of an array, thus be at least 2 segments long'
        )
      }
      // const pointer = pathSegmentsToJSONPointer(pathToPathSegments(parentPath))

      const targetElements = jsonpointer.get(state.uiSchema, pathSegmentsToJSONPointer(pathToPathSegments(parentPath)))
      const sourceElements = jsonpointer.get(
        state.uiSchema,
        pathSegmentsToJSONPointer(pathToPathSegments(sourceParentPath))
      )

      if (!Array.isArray(targetElements) || !Array.isArray(sourceElements)) {
        throw new Error("target or source elements are not an array, can't move element")
      }
      const [movedElement] = sourceElements.splice(sourceIndex, 1)
      targetElements.splice(targetIndex, 0, movedElement)
    }
  },
})

export const {
  insertControl,
  selectElement,
  renameField,
  removeFieldOrLayout,
  removeField,

  updateUISchemaByScope,
  updateJsonSchemaByPath,
  loadTemplate,
  moveControl,
} = jsonFormsEditSlice.actions

export const jsonFormsEditReducer = jsonFormsEditSlice.reducer
