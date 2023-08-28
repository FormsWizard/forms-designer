'use client'

import React from 'react'
import { makeStore } from '@formswizard/state'
import { Provider } from 'react-redux'
import { DndProvider , useDrag, useDrop, useDragLayer } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DNDHooksContext } from '@formswizard/react-hooks'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { getTheme } from '@formswizard/theme'
import { CacheProvider } from '@emotion/react'
import createEmotionCache from './createEmotionCache'

const store = makeStore()

const theme = getTheme('dark')
const clientSideEmotionCache = createEmotionCache()

type WizardProviderProps = {
  children: React.ReactNode
}
export function WizardProvider({ children }: WizardProviderProps) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DndProvider backend={HTML5Backend}>
            <DNDHooksContext.Provider value={{ useDrag, useDrop, useDragLayer }}>
              <CssBaseline />
              {children}
            </DNDHooksContext.Provider>
          </DndProvider>
        </ThemeProvider>
      </Provider>
    </CacheProvider>
  )
}
