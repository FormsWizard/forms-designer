import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import jsonFormsEditReducer from '../features/wizard/WizardSlice'
import templateSlice from '../features/wizard/TemplateSlice'
import AppBarSlice from '../features/AppBar/AppBarSlice'
import buildingBlocksSlice from '../features/buildingBlocks/buildingBlocksSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    jsonFormsEdit: jsonFormsEditReducer,
    template: templateSlice,
    AppBar: AppBarSlice,
    buildingBlocks: buildingBlocksSlice,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

function jsonformsgarbagemiddleware() {}
