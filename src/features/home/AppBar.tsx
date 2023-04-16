import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'

import Toolbar from '@mui/material/Toolbar'

import Typography from '@mui/material/Typography'

function MainAppBar() {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Bar
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default MainAppBar
