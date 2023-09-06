import { locationTools } from '@formswizard/experimental-renderers_next'
import { MainLayout } from '@formswizard/forms-designer/MainLayout'

export const WizardMainLayout = () => {
  return <MainLayout additionalToolSettings={locationTools.toolSettings} renderers={locationTools.rendererRegistry} />
}
