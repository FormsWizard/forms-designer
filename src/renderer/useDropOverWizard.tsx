import React from 'react'
import { ConnectDropTarget } from 'react-dnd'

function useDropOverWizard(props: { path: string }): {
  draggedMeta: null
  isOver: boolean
  isOverCurrent: boolean
} {
  return {
    draggedMeta: null,
    isOver: false,

    isOverCurrent: false,
  }
}

export default useDropOverWizard
