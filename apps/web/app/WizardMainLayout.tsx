import { WktLiteralTextControlTester, WktLiteralTextControlRenderer, LocationToolSettings} from "@formswizard/experimental-renderers";
import {MainLayout} from "@formswizard/forms-designer/MainLayout";

const renderers = [
  {
    tester: WktLiteralTextControlTester,
    renderer: WktLiteralTextControlRenderer
  }
]

export const WizardMainLayout = () => {
  return <MainLayout additionalToolSettings={[LocationToolSettings]} renderers={renderers}/>
}
