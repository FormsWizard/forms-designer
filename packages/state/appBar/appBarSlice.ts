import { PaletteMode } from '@mui/material'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../store'

import { ScopableUISchemaElement } from "@formswizard/types"

export type AppBarState = {
  editMode: boolean
  selectedLanguage: string
  themeMode: PaletteMode | string
}

export const getEditMode = (state: RootState) => state.AppBar.editMode
export const getSelectedLanguage = (state: RootState) => state.AppBar.selectedLanguage
let defaultThemeMode = 'light'
/*if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  defaultThemeMode = 'dark'
}*/
export const appBarSlice = createSlice({
  name: 'jsonFormEdit',
  initialState: { editMode: false, selectedLanguage: 'de', themeMode: defaultThemeMode },

  reducers: {
    toggleEditMode: (state: AppBarState) => {
      state.editMode = !state.editMode
    },
    changeSelectedLanguage: (state: AppBarState, action: PayloadAction<string>) => {
      state.selectedLanguage = action.payload
    },
    toggleColorMode: (state: AppBarState) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light'
    },
  },
})

export const { toggleEditMode, changeSelectedLanguage, toggleColorMode } = appBarSlice.actions

export const appBarReducer = appBarSlice.reducer
