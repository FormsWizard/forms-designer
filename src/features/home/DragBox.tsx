import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import { Button, Card, CardActionArea, CardActions, CardContent, Typography } from '@mui/material'
import { DraggableComponent } from '../wizard/WizardSlice'

type DragBoxProps = {
  name: string
  img?: string
  componentMeta: DraggableComponent
}
const DragBox = ({ name = 'Eingabefeld', img = '', componentMeta }: DragBoxProps) => {
  const [, dragRef] = useDrag(
    () => ({
      type: 'DRAGBOX',
      item: { componentMeta },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
      end: (item, monitor) => {
        const didDrop = monitor.didDrop()
        if (didDrop) {
        }
      },
    }),
    []
  )

  return (
    <Card ref={dragRef}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          ans Ende anfügen
        </Button>
      </CardActions>
    </Card>
  )
}

export default DragBox
