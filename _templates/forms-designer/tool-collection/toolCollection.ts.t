---
to: packages/<%= name.split("/")[1] %>/src/toolCollection.ts
---
import { ToolCollection } from '@formswizard/types'
import { draggableComponents } from './draggableComponents'
import { icons } from './icons'
import { renderers } from './renderers'

export const <%= name.split("/")[1].replace(/-/g, '') %>ToolCollection: ToolCollection = {
  name: '<%= name.split("/")[1] %>',
  draggableComponents,
  icons,
  renderers,
}
