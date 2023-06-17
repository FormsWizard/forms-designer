import React from 'react'
import { useDrag } from 'react-dnd'
import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import {DraggableMeta} from '../wizard/WizardSlice'
import { Stack } from '@mui/system'

type DragBoxProps = {
  name: string
  img?: string
  componentMeta: Partial<DraggableMeta>
  ToolIcon: any
}
const DragBox = ({ name = 'Eingabefeld', img = '', componentMeta, ToolIcon = () => <></> }: DragBoxProps) => {
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
          <Stack
            direction="row"
            alignItems="center"
            gap={2}
            sx={{
              '& .MuiSvgIcon-root': {
                // fontSize: '2rem',
                color: 'secondary.dark',
              },
            }}
          >
            <ToolIcon></ToolIcon>
            <Typography gutterBottom variant="subtitle1">
              {name || ''}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default DragBox
