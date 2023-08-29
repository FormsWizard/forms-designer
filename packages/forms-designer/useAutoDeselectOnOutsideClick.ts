import { selectElement, selectPath, useAppDispatch } from '@formswizard/state'
import React, { useCallback } from 'react'

function useAutoDeselectOnOutsideClick(wizardPaperRef) {
  const dispatch = useAppDispatch()
  const handleDeselect = useCallback(() => {
    // @ts-ignore
    dispatch(selectElement(null))
    // @ts-ignore
    dispatch(selectPath(null))
  }, [dispatch])

  const handleClickOutside = (e) => {
    if (wizardPaperRef.current && !wizardPaperRef.current.contains(e.target) && e.currentTarget === e.target) {
      handleDeselect()
    }
  }

  return { handleClickOutside }
}

export default useAutoDeselectOnOutsideClick
