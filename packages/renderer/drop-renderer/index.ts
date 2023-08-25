import { verticalLayoutTester, VerticalLayoutWithDropZoneRenderer } from './VerticalLayoutWithDropZoneRenderer'
import { horizontalLayoutTester, HorizontalLayoutWithDropZoneRenderer } from './HorizontalLayoutWithDropZoneRenderer'

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
]
