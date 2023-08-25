import { withNoSSR } from './withNoSSR'
import { MainLayout, Wizard, WizardProvider } from '@formswizard/forms-designer'
const Page = () => {
  return (
    <WizardProvider>
      <MainLayout />
    </WizardProvider>
  )
}

export default withNoSSR(Page)
