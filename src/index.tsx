import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './app/store'
import App from './App'
import { HashRouter } from 'react-router-dom'
import './index.css'

import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import NiceModal from '@ebay/nice-modal-react'

import { TouchBackend } from 'react-dnd-touch-backend'

const container = document.getElementById('root')
const root = createRoot(container)
console.log('APP running in touch mode: ' + isTouchDevice())
const backend = isTouchDevice() ? TouchBackend : HTML5Backend

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <DndProvider backend={backend}>
        <HashRouter>
          <App />
        </HashRouter>
      </DndProvider>
    </ReduxProvider>
  </React.StrictMode>
)

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
