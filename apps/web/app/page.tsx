import {withNoSSR} from "./withNoSSR";
import {Wizard, WizardProvider} from "@formswizard/forms-designer";
const Page = () => {

  return <WizardProvider><Wizard /></WizardProvider>
}

export default withNoSSR(Page)
