import { configureStore, ThunkAction, Action, Middleware, EnhancedStore } from '@reduxjs/toolkit'
import { jsonFormsEditReducer } from './wizard/jsonFormsEditSlice'
import { appBarReducer } from './appBar/appBarSlice'
import { buildingBlocksReducer } from './buildingBlocks/buildingBlocksSlice'
import { formDataReducer } from './formSlice'
import {
  loadPersistedJsonFormsEditState,
  savePersistedJsonFormsEditState,
} from './wizard/jsonFormsEditPersistence'

// Define the root reducer type
type RootReducer = {
  formData: ReturnType<typeof formDataReducer>,
  jsonFormsEdit: ReturnType<typeof jsonFormsEditReducer>,
  AppBar: ReturnType<typeof appBarReducer>,
  buildingBlocks: ReturnType<typeof buildingBlocksReducer>,
}

function getPreloadedState() {
  const persisted = loadPersistedJsonFormsEditState()
  if (!persisted) return undefined
  return { jsonFormsEdit: persisted }
}

const jsonFormsEditPersistenceMiddleware: Middleware<object, RootReducer> = (store) => (next) => (action) => {
  const prev = store.getState().jsonFormsEdit
  const result = next(action)
  const nextState = store.getState().jsonFormsEdit
  if (nextState !== prev) {
    savePersistedJsonFormsEditState(nextState)
  }
  return result
}

// Type assertion avoids strict inference: partial preloadedState and custom middleware
// are valid at runtime but trigger Reducer/Middleware tuple type errors in RTK typings.
// Explicit type ensures portable .d.ts (no reference to nested .bun/redux path).
export const store: EnhancedStore<RootReducer> = configureStore({
  reducer: {
    formData: formDataReducer,
    jsonFormsEdit: jsonFormsEditReducer,
    AppBar: appBarReducer,
    buildingBlocks: buildingBlocksReducer,
  },
  preloadedState: getPreloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jsonFormsEditPersistenceMiddleware),
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any) as EnhancedStore<RootReducer>

export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']
export type RootState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
