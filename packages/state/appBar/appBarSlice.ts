import { PaletteMode } from '@mui/material'
import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit'

import { RootState } from '../store'


export type AppBarState = {
  previewModus: boolean
  selectedLanguage: string
  themeMode: PaletteMode | string
}

export const selectPreviewModus = (state: RootState) => state.AppBar.previewModus
export const selectSelectedLanguage = (state: RootState) => state.AppBar.selectedLanguage
export const selectThemeMode = (state: RootState) => state.AppBar.themeMode
let defaultThemeMode = 'light'
/*if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  defaultThemeMode = 'dark'
}*/
export const appBarSlice = createSlice({
  name: 'appbar',
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

export const { togglePreviewModus, changeSelectedLanguage, toggleColorMode } = appBarSlice.actions

export const appBarReducer: Reducer<AppBarState> = appBarSlice.reducer


