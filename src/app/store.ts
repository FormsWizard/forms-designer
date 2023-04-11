import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import jsonFormsEditReducer from "../features/counter/jsonFormsEditSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    jsonFormsEdit: jsonFormsEditReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
