import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { Box } from '@mui/system'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useDrag } from 'react-dnd'

// const P = styled('p')(({ theme }) => ({
//     color: (prop) => theme.palette.getContrastText(prop.color),
//     margin: 'auto',
// }))

const isColor = (strColor) => {
    const s = new Option().style
    s.color = strColor
    return s.color !== ''
}
function DragBox() {
    const theme = useTheme()
    const [color, setColor] = useState('')

    const initWithRandomColor = () => {
        const hex = Math.floor(Math.random() * 0xffffff)
        const color = '#' + hex.toString(16)
        if (isColor(color)) {
            setColor(color)
        }
    }
    useLayoutEffect(() => {
        // get random color
        initWithRandomColor()
    }, [])

    const [{ opacity }, dragRef] = useDrag(
        () => ({
            type: 'DRAGBOX',
            item: { color },
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.5 : 1,
            }),
            end: (item, monitor) => {
                const didDrop = monitor.didDrop()
                if (didDrop) {
                    initWithRandomColor()
                }
            },
        }),
        []
    )

    return (
        <Box
            ref={dragRef}
            sx={{
                backgroundColor: color,
                height: 100,
                flexGrow: 1,

                display: 'flex',
                opacity,
            }}
        >
            <Box
                sx={{
                    margin: 'auto',
                    color: color
                        ? theme.palette.getContrastText(color)
                        : 'black',
                }}
            >
                Dragbox in {color}
            </Box>
        </Box>
    )
}

export default DragBox
