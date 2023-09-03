import { WktLiteralTextControlTester, WktLiteralTextControlRenderer, LocationToolSettings} from "@formswizard/experimental-renderers";
import {WizardProvider, MainLayout} from "@formswizard/forms-designer";

const renderers = [
  {
    tester: WktLiteralTextControlTester,
    renderer: WktLiteralTextControlRenderer
  }
]
export const App = () => {
  return <WizardProvider>
    <MainLayout additionalToolSettings={[LocationToolSettings]} renderers={renderers}/>
  </WizardProvider>
}
