'use client'

import { ToolProvider } from '@formswizard/tool-context'
import { MainLayout } from './MainLayout'
import { WizardProvider } from './WizardProvider'
import { basicToolsCollection } from '@formswizard/basic-tools'
import { advancedToolsCollection } from '@formswizard/advanced-tools'

export function WizardApp() {
  return (
    <ToolProvider
      toolCollections={[
        basicToolsCollection,
        advancedToolsCollection,
      ]}
    >
      <WizardProvider defaultInterfaceMode="touch-drag">
        <MainLayout
          multipleDefinitions={false}
        />
      </WizardProvider>
    </ToolProvider>
  )
}