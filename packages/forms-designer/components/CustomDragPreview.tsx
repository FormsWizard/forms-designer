import React from 'react'
import { usePreview } from 'react-dnd-preview'
import { Card, CardContent, Typography, Box, Stack } from '@mui/material'
import { useIcon } from '@formswizard/tool-context'
import TocOutlined from '@mui/icons-material/TocOutlined'
import { DraggableElement, DraggableMeta } from '@formswizard/types'

function PreviewContent() {
  try {
    const preview = usePreview()
    
    if (!preview.display) {
      return null
    }


    const { itemType, item, style } = preview as { itemType: string, item: { componentMeta: DraggableMeta }, style: React.CSSProperties }

    // Handle both DRAGBOX and MOVEBOX items
    if (itemType !== 'DRAGBOX' && itemType !== 'MOVEBOX') {
      return null
    }

    // Extract component metadata
    const componentMeta = item?.componentMeta
    let name = componentMeta?.name || 'Component'
    let toolIconName = componentMeta?.ToolIconName || 'TocOutlined'

    // For MOVEBOX items, use simpler name (just the component name)
    if (itemType === 'MOVEBOX') {
      name = componentMeta?.name?.split('.')?.pop() || name
    }
    
    // Get the icon component
    const ToolIcon = useIcon(toolIconName) || TocOutlined

    return (
      <Box style={style}>
        <Card 
          sx={{ 
            opacity: 0.8,
            transform: 'rotate(2deg)',
            boxShadow: 3,
            minWidth: 150,
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Stack
              direction="row"
              alignItems="center"
              gap={1.5}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: '1.2rem',
                  color: 'secondary.dark',
                },
              }}
            >
              <ToolIcon />
              <Typography variant="subtitle2" noWrap>
                {name}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    )
  } catch (error) {
    console.warn('CustomDragPreview error:', error)
    return null
  }
}

export function CustomDragPreview() {
  return <PreviewContent />
}
