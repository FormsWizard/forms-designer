import MaterialEnumArrayWithLabelRendererWithProps, {
  materialEnumArrayWithLabelRendererTester,
} from './MultiEnumArrayRendererWithLabel'
import MaterialAlertRendererWithProps, { materialAlertRendererTester } from './MaterialAlertRenderer'

export * from './MaterialAlertRenderer'
export * from './MultiEnumArrayRendererWithLabel'

export const basicRenderer = [
  {
    tester: materialEnumArrayWithLabelRendererTester,
    renderer: MaterialEnumArrayWithLabelRendererWithProps,
  },
  {
    tester: materialAlertRendererTester,
    renderer: MaterialAlertRendererWithProps,
  },
]
