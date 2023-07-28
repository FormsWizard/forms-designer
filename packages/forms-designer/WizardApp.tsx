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

const store = makeStore()

export function WizardApp() {
  return <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <DNDHooksContext.Provider value={{useDrag, useDrop, useDragLayer}}>
        <MainLayout/>
      </DNDHooksContext.Provider>
    </DndProvider>
  </Provider>
}
