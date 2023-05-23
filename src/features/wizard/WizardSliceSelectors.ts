import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export const selectJsonSchema = (state: RootState) => state.jsonFormsEdit.jsonSchema

export const selectSelectedElementKey = (state: RootState) => state.jsonFormsEdit.selectedElementKey

const selectSelectedElementJsonSchema = createSelector(
  selectJsonSchema,
  selectSelectedElementKey,
  (jsonSchema, selectedElementKey) => {
    if (!selectedElementKey) {
      return null
    }
    const selectedElement = getJsonSchemaByPath(jsonSchema, selectedElementKey)

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
