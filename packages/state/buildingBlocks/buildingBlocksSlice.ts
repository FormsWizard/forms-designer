import { resolveSchema } from '@jsonforms/core'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { cloneDeep, last } from 'lodash'
import { advancedDraggableComponents } from './advancedDraggableComponents'
import { getAllScopesInSchema, scopeToPathSegments } from '@formswizard/utils'

const initialState = {
  blocks: [...advancedDraggableComponents],
}

export type buildingBlocksSlice = {
    blocks: any[]
}  

export const buildingBlocksSlice = createSlice({
  name: 'buildingBlocks',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addBuildingBlock: (state: buildingBlocksSlice, action: PayloadAction<any, any>) => {
      const { item, jsonSchema, ToolIconName } = action.payload
      const scopes = getAllScopesInSchema(item.componentMeta.uiSchema)
      scopes.sort((a, b) => scopeToPathSegments(a).length - scopeToPathSegments(b).length)
      let blockSchema = { type: 'object', properties: {} }

      let groupName = last(scopeToPathSegments(item.componentMeta.uiSchema.scope)) as string

      let groupNameTester = groupName
      for (
        let i = 1;
        //@ts-ignore
        state.blocks.find(b => b.name === groupNameTester) !== undefined; 
        i++
      ) {
        groupNameTester = `${groupName}_${i}`
      }
      groupName = groupNameTester

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
        ToolIconName,
      }
      console.log('adding building block', blockItem)
      state.blocks.push(blockItem)
    },
    removeBuildingBlock: (state: buildingBlocksSlice, action: PayloadAction<number>) => {
      state.blocks.slice(action.payload, 1)
    },
  },
})

export const { addBuildingBlock, removeBuildingBlock } = buildingBlocksSlice.actions

export default buildingBlocksSlice.reducer
