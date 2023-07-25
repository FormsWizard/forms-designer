import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { jsonFormsEditReducer, templateSliceReducer } from '@formswizard/forms-designer'
export const makeStore = () => configureStore({
  reducer: {
    jsonFormsEdit: jsonFormsEditReducer,
    template: templateSliceReducer
  }
})

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch =  AppStore['dispatch']
export type RootState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
