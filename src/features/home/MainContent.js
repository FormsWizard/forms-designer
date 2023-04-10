import * as React from 'react'
import Box from '@mui/material/Box'

import Toolbar from '@mui/material/Toolbar'

import Typography from '@mui/material/Typography'
import { useDrop } from 'react-dnd'
import { List, ListItemText } from '@mui/material'

export default function MainContent() {
    const [listColors, setlistColors] = React.useState([])
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ['DRAGBOX'],
        drop: ({ color }, b, c) =>
            setlistColors((prev) => [...prev, 'dropped ' + color]),
        collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    }))

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <Box
                sx={{
                    flexGrow: 1,
                    m: 5,
                    bgcolor: (theme) =>
                        isOver ? theme.palette.info.light : theme.status.danger,
                    height: 500,
                }}
                ref={drop}
            >
                <List>
                    {listColors.map((color) => (
                        <ListItemText primary={color} />
                    ))}
                </List>
            </Box>
        </Box>
    )
}
