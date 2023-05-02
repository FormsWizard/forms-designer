import React from 'react'

function useDropOverWizard(props: { path: string }): { draggedMeta: null; isOver: boolean; isOverCurrent: boolean } {
  return {
    draggedMeta: null,
    isOver: false,

    isOverCurrent: false,
  }
}

export default useDropOverWizard
