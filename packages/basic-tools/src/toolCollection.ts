import { FormsDesignerToolCollection } from '@formswizard/types'
import { draggableComponents } from './draggableComponents'
import { icons } from './icons'
import { renderers } from './renderers'
import { toolSettings } from './toolSettings'
import { translations } from './translations'
import { materialCells } from '@jsonforms/material-renderers'

export const basicToolsCollection: FormsDesignerToolCollection = {
  info: {
    name: 'basic-tools',
    description: 'Basic form tools like text fields, numbers, dates, checkboxes, etc.',
    categories: ['input', 'basic', 'forms']
  },
  draggableElements: draggableComponents,
  iconRegistry: icons,
  rendererRegistry: renderers,
  cellRendererRegistry: materialCells,
  toolSettings,
  translations,
}
