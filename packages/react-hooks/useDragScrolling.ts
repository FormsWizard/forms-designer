import { useAppDispatch, useAppSelector } from '@formswizard/state'
import React, { useEffect } from 'react'
import { useDragDropManager } from 'react-dnd'

function useDragScrolling() {
  const dragDropManager = useDragDropManager()
  const monitor = dragDropManager.getMonitor()

  const previewModus = useAppSelector(getPreviewModus)

  useEffect(() => {
    const unsubscribe = monitor.subscribeToOffsetChange(() => {
      const offset = monitor.getSourceClientOffset()?.y as number
      updatePosition(offset)
    })
    return unsubscribe
  }, [monitor, updatePosition])
}

export default useDragScrolling
