import React, { createElement } from 'react'
import { Card, CardActionArea, CardContent, Typography, Icon } from '@mui/material'
import { Stack } from '@mui/system'
import { useDNDHooksContext } from '@formswizard/react-hooks'
import { DraggableMeta } from '@formswizard/types'
/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as MuiIcons from '@mui/icons-material'
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
    <>
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
              {/* crashes on next build or other restrictive dts-build because of TS7053 */}
              {createElement((MuiIcons as any)[ToolIconName])}

              <Typography gutterBottom variant="subtitle1">
                {name || ''}
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  )
}
