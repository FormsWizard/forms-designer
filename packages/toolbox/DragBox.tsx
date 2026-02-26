import React, { createElement } from 'react'
import { Card, CardActionArea, CardContent, Typography, Icon, Box } from '@mui/material'
import { Stack } from '@mui/system'
import { useDNDHooksContext } from '@formswizard/react-hooks'
import { DraggableMeta } from '@formswizard/types'
/*eslint import/namespace: ['error', { allowComputed: true }]*/
import TocOutlined from '@mui/icons-material/TocOutlined'
import { useIcon } from '@formswizard/tool-context'

type DragBoxProps = {
  name: string
  img?: string
  componentMeta: Partial<DraggableMeta>
  ToolIconName?: string
}
export const DragBox = ({
  name = 'Eingabefeld',
  img = '',
  componentMeta,
  ToolIconName = 'TocOutlined',
}: DragBoxProps) => {
  const { useDrag } = useDNDHooksContext()
  const ToolIcon = useIcon(ToolIconName) || null
  const [{ opacity }, dragRef, preivewRef] = useDrag(
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
    <Box ref={preivewRef}>
      <Card ref={dragRef} >
        <CardActionArea>
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              gap={2}
              sx={{
                opacity: opacity,
                '& .MuiSvgIcon-root': {
                  // fontSize: '2rem',
                  color: 'secondary.dark',
                },
              }}
            >
              {ToolIcon && <ToolIcon />}
              <Typography gutterBottom variant="subtitle1">
                {name || ''}
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  )
}
