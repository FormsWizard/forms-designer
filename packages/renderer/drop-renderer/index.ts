import { verticalLayoutTester, VerticalLayoutWithDropZoneRenderer } from './VerticalLayoutWithDropZoneRenderer'
import { horizontalLayoutTester, HorizontalLayoutWithDropZoneRenderer } from './HorizontalLayoutWithDropZoneRenderer'
import { materialEditableGroupTester, MaterialEditableGroupLayoutRenderer } from './MaterialEditableGroupLayout'

export * from './HorizontalLayoutWithDropZoneRenderer'
export * from './VerticalLayoutWithDropZoneRenderer'
export const dropRenderer = [
  {
    tester: verticalLayoutTester,
    renderer: VerticalLayoutWithDropZoneRenderer,
  },
  {
    tester: horizontalLayoutTester,
    renderer: HorizontalLayoutWithDropZoneRenderer,
  },
  {
    tester: materialEditableGroupTester,
    renderer: MaterialEditableGroupLayoutRenderer,
  },
]
