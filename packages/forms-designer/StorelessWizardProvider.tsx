'use client'

import { DndProvider, useDrag, useDrop, useDragLayer, useDragDropManager } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DNDHooksContext } from '@formswizard/react-hooks'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { getTheme } from '@formswizard/theme'
import { CacheProvider } from '@emotion/react'
import createEmotionCache from './createEmotionCache'

const theme = getTheme('dark')
const clientSideEmotionCache = createEmotionCache()

type WizardProviderProps = {
  children: React.ReactNode
}

export const StorelessWizardProvider: ({ children }: WizardProviderProps) => JSX.Element = ({
  children,
}: WizardProviderProps) => (
  <CacheProvider value={clientSideEmotionCache}>
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <DNDHooksContext.Provider value={{ useDrag, useDrop, useDragLayer, useDragDropManager }}>
          <CssBaseline />
          {children}
        </DNDHooksContext.Provider>
      </DndProvider>
    </ThemeProvider>
  </CacheProvider>
)
