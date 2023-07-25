import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type {RootState, AppDispatch, AppStore} from './store'
import { createWrapper } from "next-redux-wrapper";
import {makeStore} from "./store";


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const reduxWrapper = createWrapper<AppStore>(makeStore);