import { DraggableElement, PluggableToolDefinition } from '@formswizard/types'
import { LocationSearchTextControlRenderer, WktLiteralTextControlTester } from './LocationSearchTextFieldRenderer'
import { LocationToolSettings } from './LocationToolSettings'

export const locationToolElements: DraggableElement[] = [
  {
    name: 'Location',
    ToolIconName: 'Location',
    jsonSchemaElement: {
      type: 'string',
      format: 'wktLiteral',
    },
  },
]

export const locationTools: PluggableToolDefinition = {
  dropRendererRegistry: [],
  rendererRegistry: [
    {
      tester: WktLiteralTextControlTester,
      // renderer: WktLiteralTextControlRenderer,
      renderer: LocationSearchTextControlRenderer,
    },
  ],
  toolSettings: [LocationToolSettings],
  toolBoxElements: locationToolElements
}
