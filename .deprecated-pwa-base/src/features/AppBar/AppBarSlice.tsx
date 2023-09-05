import { PaletteMode } from '@mui/material'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../../app/store'

import { ScopableUISchemaElement } from '../../types'

export type AppBarState = {
  previewModus: boolean
  selectedLanguage: string
  themeMode: PaletteMode
}

export const getpreviewModus = (state: RootState) => state.AppBar.previewModus
export const getSelectedLanguage = (state: RootState) => state.AppBar.selectedLanguage
let defaultThemeMode = 'light'
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  defaultThemeMode = 'dark'
}
export const AppBarSlice = createSlice({
  name: 'jsonFormEdit',
  initialState: { previewModus: false, selectedLanguage: 'de', themeMode: defaultThemeMode },

  reducers: {
    togglePreviewModus: (state: AppBarState) => {
      state.previewModus = !state.previewModus
    },
    changeSelectedLanguage: (state: AppBarState, action: PayloadAction<string>) => {
      state.selectedLanguage = action.payload
    },
    toggleColorMode: (state: AppBarState) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light'
    },
  },
})

export const { togglePreviewModus, changeSelectedLanguage, toggleColorMode } = AppBarSlice.actions

export default AppBarSlice.reducer
