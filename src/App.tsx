import React from 'react'

import { ThemeProvider } from '@mui/material/styles'

import './App.css'
import Routes from './Routes'
import { CssBaseline } from '@mui/material'
import CustomDragAndDropPreview from './features/dragAndDrop/CustomDragAndDropPreview'
import { IntlProvider } from 'react-intl'
import messages from './locals/index'
import { useSelector } from 'react-redux'
import { getSelectedLanguage } from './features/AppBar/AppBarSlice'

import { darkTheme, lightTheme } from './theme'
import { useAppSelector } from './app/hooks/reduxHooks'
function App() {
  const locale = useAppSelector(getSelectedLanguage)
  const themeMode = useAppSelector((state) => state.AppBar.themeMode)
  return (
    <IntlProvider messages={messages[locale]} locale={locale} defaultLocale="de">
      <ThemeProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
        <div className="App">
          <CssBaseline></CssBaseline>
          <Routes></Routes>
          <CustomDragAndDropPreview></CustomDragAndDropPreview>
        </div>
      </ThemeProvider>
    </IntlProvider>
  )
}

export default App
