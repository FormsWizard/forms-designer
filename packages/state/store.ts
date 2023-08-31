import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { jsonFormsEditReducer } from './wizard/jsonFormsEditSlice'
import { appBarReducer } from './appBar/appBarSlice'
import buildingBlocksSlice from './buildingBlocks/buildingBlocksSlice'
export const makeStore = () =>
  configureStore({
    reducer: {
      jsonFormsEdit: jsonFormsEditReducer,
      AppBar: appBarReducer,
      buildingBlocks: buildingBlocksSlice
    },
  })

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
export type RootState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
