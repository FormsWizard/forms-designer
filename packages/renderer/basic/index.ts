import {
  MaterialEnumArrayWithLabelRenderer,
  materialEnumArrayWithLabelRendererTester,
} from './MultiEnumArrayRendererWithLabel'
import { MaterialAlertRenderer, materialAlertRendererTester } from './MaterialAlertRenderer'

export * from './MaterialAlertRenderer'
export * from './MultiEnumArrayRendererWithLabel'

export const basicRenderer = [
  {
    tester: materialEnumArrayWithLabelRendererTester,
    renderer: MaterialEnumArrayWithLabelRenderer,
  },
  {
    tester: materialAlertRendererTester,
    renderer: MaterialAlertRenderer,
  },
]
