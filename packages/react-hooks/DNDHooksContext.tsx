import { createContext, useContext } from 'react'
import {
  useDrag as useDragHook,
  useDrop as useDropHook,
  useDragLayer as useDragLayerHook,
  useDragDropManager as useDragDropManagerHook,
} from 'react-dnd'

type DNDHooksContextType = {
  useDrag: typeof useDragHook
  useDrop: typeof useDropHook
  useDragLayer: typeof useDragLayerHook
  useDragDropManager: typeof useDragDropManagerHook
}
export const DNDHooksContext = createContext<DNDHooksContextType>({
  useDrag: () => {
    throw new Error('useDrag must be used within a DNDHooksProvider')
  },
  useDrop: () => {
    throw new Error('useDrop must be used within a DNDHooksProvider')
  },
  useDragLayer: () => {
    throw new Error('useDragLayer must be used within a DNDHooksProvider')
  },
  useDragDropManager: () => {
    throw new Error('useDragDropManager must be used within a DNDHooksProvider')
  },
})

export const useDNDHooksContext = () => useContext(DNDHooksContext)
