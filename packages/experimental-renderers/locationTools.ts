import {DraggableElement, PluggableToolDefinition} from "@formswizard/types";
import {WktLiteralTextControlRenderer, WktLiteralTextControlTester} from "./LocationSearchTextFieldRenderer";
import {LocationToolSettings} from "./LocationToolSettings";

export const locationToolElements: DraggableElement[] = [
  {
    name: 'Location',
    ToolIconName: 'LocationOn',
    jsonSchemaElement: {
      type: 'string',
      format: 'wktLiteral'
    }
  }]


export const locationTools: PluggableToolDefinition = {
  dropRendererRegistry: [],
  rendererRegistry: [
    {
      tester: WktLiteralTextControlTester,
      renderer: WktLiteralTextControlRenderer
    }
  ],
  toolSettings: [LocationToolSettings],
  toolBoxElements: locationToolElements
}
