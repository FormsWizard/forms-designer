'use client'

import { store } from '@formswizard/state'
import { Provider } from 'react-redux'
import { DndProvider, useDrag, useDrop, useDragLayer, useDragDropManager } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { DNDHooksContext } from '@formswizard/react-hooks'
import { CacheProvider } from '@emotion/react'
import createEmotionCache from './createEmotionCache'
import { ThemeWrapper } from './ThemeWrapper'
import { useInterfaceMode, InterfaceModeProvider } from './context'
import { CustomDragPreview } from './components'
import { useMemo } from 'react'


const clientSideEmotionCache = createEmotionCache()

type WizardProviderProps = {
  children: React.ReactNode
  defaultInterfaceMode?: 'touch-drag' | 'mouse-drag' | 'click-based'
}

function DynamicDndProvider({ children }: { children: React.ReactNode }) {
  const { interfaceMode } = useInterfaceMode()
  
  // Select backend based on interface mode
  const backend = useMemo(() => interfaceMode === 'touch-drag' ? TouchBackend : HTML5Backend, [interfaceMode]) 
  const isTouchMode = interfaceMode === 'touch-drag'
  
  return (
    <DndProvider backend={backend}>
      <DNDHooksContext.Provider value={{ useDrag, useDrop, useDragLayer, useDragDropManager }}>
        {children}
        {isTouchMode && <CustomDragPreview />}
      </DNDHooksContext.Provider>
    </DndProvider>
  )
}

export function WizardProvider({ children, defaultInterfaceMode = 'mouse-drag' }: WizardProviderProps) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <Provider store={store}>
        <InterfaceModeProvider defaultMode={defaultInterfaceMode}>
          <ThemeWrapper>
            <DynamicDndProvider>
              {children}
            </DynamicDndProvider>
          </ThemeWrapper>
        </InterfaceModeProvider>
      </Provider>
    </CacheProvider>
  )
}
