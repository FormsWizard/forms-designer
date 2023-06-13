import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../../app/store'

import { ScopableUISchemaElement } from '../../types'

export type AppBarState = {
  editMode: boolean
  selectedLanguage: string
  themeMode: string
}

export const getEditMode = (state: RootState) => state.AppBar.editMode
export const getSelectedLanguage = (state: RootState) => state.AppBar.selectedLanguage
let defaultThemeMode = 'light'
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  defaultThemeMode = 'dark'
}
export const AppBarSlice = createSlice({
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

export const { toggleEditMode, changeSelectedLanguage, toggleColorMode } = AppBarSlice.actions

export default AppBarSlice.reducer
