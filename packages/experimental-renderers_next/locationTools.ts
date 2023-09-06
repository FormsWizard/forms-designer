import { DraggableElement, PluggableToolDefinition } from '@formswizard/types'
import { locationToolElements, LocationToolSettings } from '@formswizard/experimental-renderers'
import { LocationSearchTextControlRenderer, WktLiteralTextControlTester } from './LocationSearchTextFieldRenderer'

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
