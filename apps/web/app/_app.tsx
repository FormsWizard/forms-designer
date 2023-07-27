import type {AppProps} from 'next/app'
import React, {useMemo} from "react";

import {HTML5Backend} from 'react-dnd-html5-backend'
import {DndProvider} from 'react-dnd'
import {TouchBackend} from 'react-dnd-touch-backend'
import {CssBaseline, ThemeProvider} from "@mui/material";
import defaultTheme from "./default-theme";

import {CacheProvider, EmotionCache} from '@emotion/react';
import createEmotionCache from "./createEmotionCache";
import {reduxWrapper} from "./reduxHooks";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export type WizardAppProps = AppProps & {
  emotionCache?: EmotionCache;
}
function App({Component, emotionCache = clientSideEmotionCache, ...rest}: WizardAppProps) {
  const backend = isTouchDevice() ? TouchBackend : HTML5Backend
  const { props: pageProps, store } = reduxWrapper.useWrappedStore(rest)
  return <CacheProvider value={emotionCache}>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline/>
          <Component {...pageProps} />
        </ThemeProvider>
  </CacheProvider>
}

export default App
