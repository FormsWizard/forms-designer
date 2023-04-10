import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import Toolbar from '@mui/material/Toolbar'

import DragBox from './DragBox'

const drawerWidth = 240

export default function RightDrawer() {
    return (
        <Drawer
            variant="permanent"
            anchor="right"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Toolbar />
            <Box
                sx={{
                    overflow: 'auto',
                    '& > div': {
                        margin: 1,
                    },
                }}
            >
                <DragBox></DragBox>
                <DragBox></DragBox>
                <DragBox></DragBox>
                <DragBox></DragBox>
            </Box>
        </Drawer>
    )
}



