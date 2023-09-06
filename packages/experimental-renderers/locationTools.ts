import { DraggableElement, PluggableToolDefinition } from '@formswizard/types'
import { LocationSearchTextControlRenderer, WktLiteralTextControlTester } from './LocationSearchTextFieldRenderer'
import { LocationToolSettings } from './LocationToolSettings'
import { locationToolElements } from './locationToolElement'

export const locationTools: PluggableToolDefinition = {
  dropRendererRegistry: [],
  rendererRegistry: [
    {
      tester: WktLiteralTextControlTester,
      renderer: LocationSearchTextControlRenderer,
    },
  ],
  toolSettings: [LocationToolSettings],
  toolBoxElements: locationToolElements,
}
