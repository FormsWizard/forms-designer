import { createSelector, createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import { JsonSchema, Resolve, resolveSchema, Scopable, setSchema, UISchemaElement } from '@jsonforms/core'
import { RootState } from '../../app/store'
import {
  getAllScopesInSchema,
  getIndexFromPath,
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
import { exampleInitialState2, JsonFormsEditState } from './exampleState'
import jsonpointer from 'jsonpointer'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { findLastIndex, last } from 'lodash'
import collectSchemaGarbage from '../../utils/collectSchemaGargabe'

export type DraggableMeta = {
  name: string
  ToolIcon: OverridableComponent<any>
}

export type DraggableComponent = Partial<DraggableMeta> & {
  jsonSchemaElement: JsonSchema
  uiSchema?: UISchemaElement
}

export type DraggableUISchemaElement = Partial<DraggableMeta> & {
  uiSchema: UISchemaElement
}

export type DraggableElement = DraggableComponent | DraggableUISchemaElement

export const isDraggableComponent = (element: any): element is DraggableComponent =>
  element.name && element.jsonSchemaElement
export const isDraggableUISchemaElement = (element: any): element is DraggableUISchemaElement => element.uiSchema
export const selectJsonSchema = (state: RootState) => state.jsonFormsEdit.jsonSchema

export const selectUiSchema = (state: RootState) => state.jsonFormsEdit.uiSchema

export const selectSelectedElementKey = (state: RootState) => state.jsonFormsEdit.selectedElementKey
export const selectSelectedPath = (state: RootState) => state.jsonFormsEdit.selectedPath
//TODO: document further
export const selectUIElementByScope = (uiSchema: UISchemaElement, scope: string) => {
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
export const selectUIElementByPath = (uiSchema: UISchemaElement, path: string) => {
  const pathSegments = path?.split('.') || []
  const scope = pathSegmentsToScope(pathSegments)
  return selectUIElementByScope(uiSchema, scope)
}

export const selectUIElementFromSelection = createSelector(
  selectSelectedPath,
  selectUiSchema,
  (selectedPath, uiSchema) => {
    if (!selectedPath) return undefined
    // if type is layout name is actually an index
    if (selectedPath.includes('-')) {
      const [UiElementType, UiElementName] = selectedPath.split('-')
      return undefined
    }
    return jsonpointer.get(uiSchema, pathSegmentsToJSONPointer(pathToPathSegments(selectedPath)))
  }
)

// const selectUIElementByPath = createSelector([selectSelectedElementKey], (selectedElementKey) => {
//   if (!selectedElementKey || selectedElementKey.startsWith('layout')) {
//     return undefined
//   }
//   return selectUIElementByPath(state, selectedElementKey)
// })

export const selectEditMode = (state: RootState) => state.jsonFormsEdit.editMode
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

  if (draggableComponent.uiSchema) {
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

const getUiSchemaWithScope: (
  draggableComponent: DraggableComponent | DraggableUISchemaElement,
  deepestGroupPath: string[],
  newKey: string
) => UISchemaElement | undefined = (draggableComponent, deepestGroupPath, newKey) => {
  const { name, uiSchema } = draggableComponent

  const rootScope = pathSegmentsToScope([...deepestGroupPath, newKey])
  const originalScope = pathSegmentsToScope([...deepestGroupPath, draggableComponent.name])
  const scopedUiSchema = updateScopeOfUISchemaElement(originalScope, rootScope, uiSchema)
  return {
    type: 'Control',
    ...(scopedUiSchema || {}),
    scope: rootScope,
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

  let schemaPath = []
  deepestGroup.reduce((prev, curr) => {
    let index = parseInt(curr)
    if (isNaN(index)) return prev
    let element = prev[index]
    if (element.type === 'Group' && element.scope) {
      schemaPath.push(last(scopeToPathSegments(element.scope)))
    }
    if (element.elements) {
      return element.elements
    }
    return element
  }, uiSchema.elements)
  // console.log(current(uiSchema))

  return schemaPath
}

export const jsonFormsEditSlice = createSlice({
  name: 'jsonFormEdit',
  initialState: exampleInitialState2,
  reducers: {
    selectElement: (state: JsonFormsEditState, action: PayloadAction<string | undefined>) => {
      state.selectedElementKey = action.payload
    },
    selectPath: (state: JsonFormsEditState, action: PayloadAction<string | undefined>) => {
      state.selectedPath = action.payload
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

    removeField: (state: JsonFormsEditState, action: PayloadAction<{ path: string }>) => {
      const { path } = action.payload
      state.jsonSchema = deeplyRemoveNestedProperty(state.jsonSchema, path)
    },
    updateJsonSchemaByPath: (
      state: JsonFormsEditState,
      action: PayloadAction<{ path: string; updatedSchema: any; updatedUIschema: any }>
    ) => {
      // path is the path to the uiSchema element e.g. elements.0.elements.0
      const { path, updatedSchema, updatedUIschema } = action.payload
      const uiSchema = jsonpointer.get(state.uiSchema, pathSegmentsToJSONPointer(pathToPathSegments(path)))
      jsonpointer.set(state.uiSchema, pathSegmentsToJSONPointer(pathToPathSegments(path)), updatedUIschema)
      // only update json schema if ui schema has a scope
      if (uiSchema?.scope) {
        const schema = resolveSchema(state.jsonSchema, uiSchema.scope, state.jsonSchema)
        if (schema) {
          Object.assign(schema, updatedSchema)
        }
      }
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
      const path = child.path === '' ? 'elements.0' : isPlaceholder ? child.path + '.elements.0' : child.path,
        pathSegments = pathToPathSegments(path),
        oldUISchemaElements = getParentUISchemaElements(path, state.uiSchema),
        elIndex = parseInt(pathSegments[pathSegments.length - 1]),
        targetIndex = elIndex + (placeBefore ? 0 : 1)
      if (isNaN(elIndex)) {
        console.error('cannot get the index of the current ui element, dropped on, the path is', path)
        return
      }
      let uiSchema = draggableMeta.uiSchema
      if (isDraggableComponent(draggableMeta)) {
        // TODO scope is not set correctly
        const deepestGroupPath = getDeepestGroupPath(child.structurePath, state.uiSchema)
        const schemaInGroup = getJsonSchemaByPath(state.jsonSchema, deepestGroupPath.join('.'))

        let newKey = draggableMeta.name
        // this looks a bit whacky, but since we allways create the group on the first level, and fields on the group level, we check both
        for (
          let i = 1;
          schemaInGroup.properties[newKey] !== undefined || state.jsonSchema.properties[newKey] !== undefined;
          i++
        ) {
          newKey = `${draggableMeta.name}_${i}`
        }
        uiSchema = getUiSchemaWithScope(draggableMeta, deepestGroupPath, newKey)
        state.jsonSchema = deeplySetNestedProperty(
          state.jsonSchema,
          deepestGroupPath,
          newKey,
          draggableMeta.jsonSchemaElement,
          true
        )
      }
      oldUISchemaElements.splice(targetIndex, 0, uiSchema)
      // buildSchemaFromUISchema(state.uiSchema)
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
      const { index, parentPath } = getIndexAndParentPathOfUISchemaElement(child.path)
      // this is the move source
      const { path: sourcePath } = draggableMeta.uiSchema as any
      const { index: sourceIndex, parentPath: sourceParentPath } = getIndexAndParentPathOfUISchemaElement(sourcePath)

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
    },
    toggleEditMode: (state: JsonFormsEditState) => {
      state.editMode = !state.editMode
    },
  },
})

export const {
  insertControl,
  selectElement,
  selectPath,
  renameField,
  removeFieldOrLayout,
  removeField,

  updateUISchemaByScope,
  toggleEditMode,
  updateJsonSchemaByPath,
  loadTemplate,
  moveControl,
} = jsonFormsEditSlice.actions

export default jsonFormsEditSlice.reducer

function buildSchemaFromUISchema(uiSchema) {
  const newSchema: JsonSchema = {}
  console.log(current(uiSchema))
  const allScopes = mapUiSchemaToJSONSchema(uiSchema, newSchema)

  exampleInitialState2.jsonSchema = newSchema
  return newSchema
}

function mapUiSchemaToJSONSchema(uiSchema, newSchema) {
  // we only care about groups and scopaable elements

  if (uiSchema.type === 'Group') {
    newSchema.type = 'object'
    newSchema.id = uiSchema.label
    newSchema.properties = {}
  }
  if (uiSchema.scope) {
    newSchema.type = 'object'
    newSchema.id = uiSchema.label
    newSchema.properties = {}
  }
}
function getJsonSchemaByPath(jsonSchema, path) {
  const pathArray = path.split('.')
  const selectedElement = pathArray.reduce((prev, key) => {
    if (prev?.type === 'object' && prev.properties && prev.properties[key]) {
      return prev.properties[key]
    }
    return prev
  }, jsonSchema)
  return selectedElement
}
