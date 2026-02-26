import { FormsDesignerToolCollection } from '@formswizard/types'
import { draggableComponents } from './draggableComponents'
import { icons } from './icons'
import { renderers } from './renderers'
import { toolSettings } from './toolSettings'
import { translations } from './translations'

export const advancedToolsCollection: FormsDesignerToolCollection = {
  info: {
    name: 'advanced-tools',
    description: 'Advanced form tools like location pickers, person forms, and complex layouts',
    categories: ['advanced', 'location', 'complex']
  },
  draggableElements: draggableComponents,
  iconRegistry: icons,
  rendererRegistry: renderers,
  toolSettings,
  translations,
}
