'use client'

import React from "react";
import {makeStore} from "state";
import {Wizard} from "./Wizard";
import {Provider} from "react-redux";
import {DndProvider} from "react-dnd";
import {TouchBackend} from "react-dnd-touch-backend";
import {HTML5Backend} from "react-dnd-html5-backend";
import MainLayout from "./MainLayout";
import {useDrag, useDrop, useDragLayer} from "react-dnd";
import {DNDHooksContext} from "react-hooks";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {getTheme} from "theme"
import {CacheProvider} from '@emotion/react';
import createEmotionCache from "./createEmotionCache";

const store = makeStore()

const theme = getTheme('dark')
const clientSideEmotionCache = createEmotionCache();

export function WizardApp() {
  return <CacheProvider value={clientSideEmotionCache}>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <DndProvider backend={HTML5Backend}>
          <DNDHooksContext.Provider value={{useDrag, useDrop, useDragLayer}}>
            <CssBaseline/>
            <MainLayout/>
          </DNDHooksContext.Provider>
        </DndProvider>
      </ThemeProvider>
    </Provider>
  </CacheProvider>
}
