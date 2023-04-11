import React from 'react';

import {ThemeProvider} from '@mui/styles'
import theme from './app/theme';

import './App.css';
import Routes from './Routes';
import {CssBaseline} from '@mui/material';

function App() {
  return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <CssBaseline></CssBaseline>
          <Routes></Routes>
        </div>
      </ThemeProvider>
  );
}

export default App;
