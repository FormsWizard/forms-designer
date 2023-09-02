import { resolveSchema } from '@jsonforms/core'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { cloneDeep, last } from 'lodash'

import { getAllScopesInSchema, scopeToPathSegments } from '../../utils/uiSchemaHelpers'
import { advancedDraggableComponents } from '../tools/DragableJSONSchemaComponents'

export interface CounterState {
  blocks: any[]
}

const initialState: CounterState = {
  blocks: [...advancedDraggableComponents],
}

export const buildingBlocksSlice = createSlice({
  name: 'buildingBlocks',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addBuildingBlock: (state, action: PayloadAction<any, any>) => {
      const { item, jsonSchema, ToolIcon } = action.payload
      const scopes = getAllScopesInSchema(item.componentMeta.uiSchema)
      scopes.sort((a, b) => scopeToPathSegments(a).length - scopeToPathSegments(b).length)
      let blockSchema = { type: 'object', properties: {} }

      let groupName = last(scopeToPathSegments(item.componentMeta.uiSchema.scope))

      for (const scope of scopes) {
        const schema = resolveSchema(jsonSchema, scope, jsonSchema)
        scopeToPathSegments(scope).reduce((acc, curr, index, array) => {
          if (index === 0) return acc
          if (index === array.length - 1) {
            acc[curr] = cloneDeep(schema)
            return acc
          } else if (!acc[curr]) {
            acc[curr] = { type: 'object', properties: {} }
          }
          return acc[curr].properties
        }, blockSchema.properties)
      }

      const blockItem = {
        name: groupName,
        uiSchema: item.componentMeta.uiSchema,
        jsonSchemaElement: blockSchema,
        ToolIcon,
      }
      console.log('adding building block', blockItem)
      state.blocks.push(blockItem)
    },
    removeBuildingBlock: (state, action: PayloadAction<number>) => {
      state.blocks.slice(action.payload, 1)
    },
  },
})

export const { addBuildingBlock, removeBuildingBlock } = buildingBlocksSlice.actions

export default buildingBlocksSlice.reducer
