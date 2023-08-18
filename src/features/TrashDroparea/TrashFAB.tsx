import { DeleteOutline } from '@mui/icons-material'
import {Fab, useTheme, Zoom} from '@mui/material'

import React, {useCallback, useMemo} from 'react'
import {DraggableComponent, removeFieldOrLayout} from "../wizard/WizardSlice";
import {useDragLayer, useDrop} from "react-dnd";
import { useAppDispatch } from '../../app/hooks/reduxHooks';

export const TrashFAB = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const transitionDuration = useMemo(() => ({
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  }), [theme])
  const handleRemove = useCallback(
      (componentMeta: DraggableComponent) => {
        dispatch(removeFieldOrLayout({ componentMeta }))
      },
      [dispatch]
  )
  const isDragging = useDragLayer((monitor) => monitor.isDragging())

  // @ts-ignore
  const [{ isOver }, dropRef] = useDrop({
    accept: ['DRAGBOX', 'MOVEBOX'],
    //@ts-ignore
    drop: ({ componentMeta }, monitor) => {
      const itemType = monitor.getItemType()
      console.log('drop', itemType)
      if ( itemType === 'MOVEBOX') {
        handleRemove(componentMeta)
      }
    },

    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
      <Zoom
          in={isDragging}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${isDragging ? transitionDuration.exit : 0}ms`,
          }}
          unmountOnExit
      >
        <Fab
            ref={dropRef}
            sx={{
              zIndex: 10000,
              position: 'absolute',
              bottom: 16,
              right: 16
            }}
            size={isOver ? 'large' : 'medium'}
            aria-label={'delete item'} color={'secondary'}>
          <DeleteOutline />
        </Fab>
      </Zoom>
  )
}

