import { materialCells, materialEnumArrayRendererTester, materialRenderers } from '@jsonforms/material-renderers'
import { horizontalLayoutTester } from './HorizontalLayoutWithDropZoneRenderer'
import HorizontalLayoutWithDropZoneRenderer from './HorizontalLayoutWithDropZoneRenderer'

import MaterialAlertRenderer, { materialAlertRendererTester } from './MaterialAlertRenderer'
import { MaterialEnumArrayWithLabelRenderer } from './MultiEnumArrayRendererWithLabel'
import VerticalLayoutWithDropZoneRenderer, { verticalLayoutTester } from './VerticalLayoutWithDropZoneRenderer'
export const renderesDropping = [
  {
    tester: verticalLayoutTester,
    renderer: VerticalLayoutWithDropZoneRenderer,
  },
  {
    tester: horizontalLayoutTester,
    renderer: HorizontalLayoutWithDropZoneRenderer,
  },
]
export const renderesBasics = [
  {
    tester: materialEnumArrayRendererTester,
    renderer: MaterialEnumArrayWithLabelRenderer,
  },
  {
    tester: materialAlertRendererTester,
    renderer: MaterialAlertRenderer,
  },
]
