import { WktLiteralTextControlTester, WktLiteralTextControlRenderer, LocationToolSettings} from "@formswizard/experimental-renderers";
import {WizardProvider, Wizard, MainLayout} from "@formswizard/forms-designer";

const renderers = [
  {
    tester: WktLiteralTextControlTester,
    renderer: WktLiteralTextControlRenderer
  }
]
export const App = () => {
  return <WizardProvider>
    <MainLayout additionalToolSettings={[LocationToolSettings]}>
        <Wizard renderers={renderers} />
    </MainLayout>
  </WizardProvider>
}
