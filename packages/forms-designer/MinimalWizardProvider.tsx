'use client'

import { DndProvider, useDrag, useDrop, useDragLayer, useDragDropManager } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DNDHooksContext } from '@formswizard/react-hooks'

type WizardProviderProps = {
  children: React.ReactNode
}

export const MinimalWizardProvider: ({ children }: WizardProviderProps) => JSX.Element = ({
  children,
}: WizardProviderProps) => (
  <DndProvider backend={HTML5Backend}>
    <DNDHooksContext.Provider value={{ useDrag, useDrop, useDragLayer, useDragDropManager }}>
      {children}
    </DNDHooksContext.Provider>
  </DndProvider>
)
