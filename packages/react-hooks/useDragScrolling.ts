import React, { useEffect } from 'react'
import { selectPreviewModus, useAppDispatch, useAppSelector } from '@formswizard/state'

import { useScroll } from './useScroll'
import { useDNDHooksContext } from './DNDHooksContext'

export function useDragScrolling() {
  const { useDragDropManager } = useDNDHooksContext()
  const { updatePosition } = useScroll()

  const dragDropManager = useDragDropManager()
  const monitor = dragDropManager.getMonitor()

  //   const previewModus = useAppSelector(selectPreviewModus)

  useEffect(() => {
    const unsubscribe = monitor.subscribeToOffsetChange(() => {
      const offset = monitor.getSourceClientOffset()?.y as number
      updatePosition(offset)
    })
    return unsubscribe
  }, [monitor, updatePosition])
}
