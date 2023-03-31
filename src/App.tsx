import React from 'react';

import './App.css';
import Routes from './Routes';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <div className="App">
      <CssBaseline></CssBaseline>
      <Routes></Routes>
    </div>
  );
}

export default App;
