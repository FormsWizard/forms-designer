import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DraggableComponent } from './WizardSlice'
import { RootState } from '../../app/store'

export type TemplateState = {
  templates: DraggableComponent[]
}

const initialState: TemplateState = {
  templates: [],
}

export const selectTemplates = (state: RootState) => state.template.templates
export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    addTemplate: (state: TemplateState, action: PayloadAction<{ element: DraggableComponent }>) => {
      const { element } = action.payload
      // @ts-ignore
      state.templates = [...state.templates, element]
    },
  },
})

export const { addTemplate } = templateSlice.actions

export default templateSlice.reducer
