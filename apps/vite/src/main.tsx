import { createRoot } from 'react-dom/client'
import { WizardProvider, MainLayout } from '@formswizard/forms-designer'
import { ToolProvider } from '@formswizard/tool-context'
import { I18nProvider } from '@formswizard/i18n'
import { basicToolsCollection } from '@formswizard/basic-tools'
import { advancedToolsCollection } from '@formswizard/advanced-tools'

const container = document.getElementById('app') as HTMLElement

const App = () => (
  <I18nProvider>
    <ToolProvider toolCollections={[basicToolsCollection, advancedToolsCollection]}>
      <WizardProvider defaultInterfaceMode="touch-drag">
        <MainLayout multipleDefinitions={false} />
      </WizardProvider>
    </ToolProvider>
  </I18nProvider>
)

const root = createRoot(container)
root.render(<App />)
