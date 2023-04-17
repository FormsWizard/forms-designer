import React from 'react'

import { ThemeProvider } from '@mui/styles'
import theme from './app/theme'

import './App.css'
import Routes from './Routes'
import { CssBaseline } from '@mui/material'
import CustomDragAndDropPreview from './features/dragAndDrop/CustomDragAndDropPreview'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <CssBaseline></CssBaseline>
        <Routes></Routes>
        <CustomDragAndDropPreview></CustomDragAndDropPreview>
      </div>
    </ThemeProvider>
  )
}

export default App
