import { DeleteOutline } from '@mui/icons-material'
import { Box } from '@mui/material'

import React, { useCallback, useRef } from 'react'
import { useDragDropManager, useDragLayer, useDrop } from 'react-dnd'
import { useAppDispatch } from '../../app/hooks/reduxHooks'
import { removeFieldAndLayout } from '../wizard/WizardSlice'

const TrashDroparea = () => {
  const dispatch = useAppDispatch()

  const handleRemove = useCallback(
    (key) => {
      dispatch(removeFieldAndLayout({ path: key }))
    },
    [dispatch]
  )
  const isDragging = useDragLayer((monitor) => monitor.isDragging())

  const [{ isOver }, drop] = useDrop({
    accept: ['DRAGBOX', 'MOVEBOX'],
    //@ts-ignore
    drop: ({ componentMeta }, monitor) => {
      // if (monitor.didDrop()) {
      //   console.log('drop')
      // }
      if (monitor.getItemType() === 'MOVEBOX') {
        handleRemove(componentMeta.name)
      } else {
        console.log('somethign other ')
      }
    },

    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
    <Box
      ref={drop}
      sx={{
        position: 'absolute',
        right: 200,
        top: 100,
        width: 180,
        height: 180,
        backgroundColor: (theme) => (isOver ? theme.palette.warning.dark : theme.palette.warning.light),
        opacity: isDragging ? 0.7 : 0,
        boxShadow: (theme) => (isOver ? theme.shadows[4] : theme.shadows[8]),
        border: '2px solid gray',
        borderRadius: 2,
        transition: 'opacity 0.3s linear 0s',
        display: 'flex',
        zIndex: 9999,
      }}
    >
      <DeleteOutline sx={{ margin: 'auto', fontSize: '44px' }}></DeleteOutline>
    </Box>
  )
}

export default TrashDroparea
