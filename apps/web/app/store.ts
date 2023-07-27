import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
export const makeStore = () => configureStore({
  reducer: {
  }
})

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch =  AppStore['dispatch']
export type RootState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
