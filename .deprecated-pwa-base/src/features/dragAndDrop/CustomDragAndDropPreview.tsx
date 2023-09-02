import React from 'react'
import { usePreview } from 'react-dnd-preview'
import { Card } from '@mui/material'
import './dnd.css'
const CustomDragAndDropPreview = () => {
  // problem: https://stackoverflow.com/questions/60960230/cant-see-the-item-that-i-am-dragging-using-react-dnd
  // solution:
  // https://www.npmjs.com/package/react-dnd-preview
  // this is a custom preview component needed to render the preview with touch backend

  const preview = usePreview()
  if (!preview.display) {
    return null
  }
  const { itemType, item, style, monitor } = preview

  // TODO: design a nice preview component for different item types
  if (itemType === 'DRAGBOX') {
    return (
      <Card className="dragbox-preview" style={style}>
        {/* TODO: understand what i have to do to remove ts-ignore :D */}
        {/* @ts-ignore */}
        Insert {item?.componentMeta?.name}
      </Card>
    )
  } else if (itemType === 'MOVEBOX') {
    return (
      <Card className="dragbox-preview" style={style}>
        {/* @ts-ignore */}
        Move {item?.componentMeta?.name?.split('.')?.pop()}
      </Card>
    )
  } else {
    //@ts-ignore
    return <div style={style}>{itemType}</div>
  }
}

export default CustomDragAndDropPreview
