import { locationTools } from '@formswizard/experimental-renderers'
import { WizardProvider, MainLayout } from '@formswizard/forms-designer'

export const App = () => {
  return (
    <WizardProvider>
      <MainLayout additionalToolSettings={locationTools.toolSettings} renderers={locationTools.rendererRegistry} />
    </WizardProvider>
  )
}
