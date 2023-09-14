import { DraggableElement } from '@formswizard/types'

export const locationToolElements: DraggableElement[] = [
  {
    name: 'Location',
    ToolIconName: 'LocationOn',
    jsonSchemaElement: {
      type: 'string',
      format: 'wktLiteral',
    },
  },
]
