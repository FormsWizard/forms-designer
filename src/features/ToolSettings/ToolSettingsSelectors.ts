import { resolveSchema } from '@jsonforms/core'
import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { selectUIElementFromSelection } from '../wizard/WizardSlice'

export const selectJsonSchema = (state: RootState) => state.jsonFormsEdit.jsonSchema

export const selectSelectedElementKey = (state: RootState) => state.jsonFormsEdit.selectedElementKey
export const selectSelectedPath = (state: RootState) => state.jsonFormsEdit.selectedPath
const selectSelectedElementJsonSchema = createSelector(
  selectJsonSchema,
  selectUIElementFromSelection,
  (jsonSchema, selectedUiSchema) => {
    // @ts-ignore
    if (!selectedUiSchema || !selectedUiSchema.scope) {
      return null
    }
    const selectedElement = resolveSchema(jsonSchema, selectedUiSchema.scope, jsonSchema)

    return selectedElement
  }
)

export { selectSelectedElementJsonSchema }

function getJsonSchemaByPath(jsonSchema, path) {
  const pathArray = path.split('.')
  const selectedElement = pathArray.reduce((prev, key) => {
    if (prev.type === 'object' && prev.properties && prev.properties[key]) {
      return prev.properties[key]
    }
    return null
  }, jsonSchema)
  return selectedElement
}
