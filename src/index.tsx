import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import theme from './theme'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import NiceModal from '@ebay/nice-modal-react'
import { IntlProvider } from 'react-intl'
const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <DndProvider backend={HTML5Backend}>
                    <IntlProvider messages={{}} locale="de" defaultLocale="en">
                    <NiceModal.Provider>

                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </NiceModal.Provider>
                    </IntlProvider>
                </DndProvider>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
