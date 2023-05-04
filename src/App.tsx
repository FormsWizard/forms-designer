import React from 'react'

import { ThemeProvider } from '@mui/styles'
import theme from './app/theme'

import './App.css'
import Routes from './Routes'
import { CssBaseline } from '@mui/material'
import CustomDragAndDropPreview from './features/dragAndDrop/CustomDragAndDropPreview'
import { IntlProvider } from 'react-intl'
import messages from './locals/index'
import { useSelector } from 'react-redux'
import { getSelectedLanguage } from './features/AppBar/AppBarSlice'
function App() {
  const locale = useSelector(getSelectedLanguage)
  return (
    <IntlProvider messages={messages[locale]} locale={locale} defaultLocale="de">
      <ThemeProvider theme={theme}>
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
