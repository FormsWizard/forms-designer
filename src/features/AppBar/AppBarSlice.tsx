import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../../app/store'

import { ScopableUISchemaElement } from '../../types'

export type JsonFormsEditState = {
  editMode: boolean
  selectedLanguage: string
}

export const getEditMode = (state: RootState) => state.AppBar.editMode
export const getSelectedLanguage = (state: RootState) => state.AppBar.selectedLanguage

export const AppBarSlice = createSlice({
  name: 'jsonFormEdit',
  initialState: { editMode: false, selectedLanguage: 'de' },
  reducers: {
    toggleEditMode: (state: JsonFormsEditState) => {
      state.editMode = !state.editMode
    },
    changeSelectedLanguage: (state: JsonFormsEditState, action: PayloadAction<string>) => {
      state.selectedLanguage = action.payload
    },
  },
})

export const { toggleEditMode, changeSelectedLanguage } = AppBarSlice.actions

export default AppBarSlice.reducer
