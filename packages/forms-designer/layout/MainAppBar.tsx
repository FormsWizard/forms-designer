import * as React from 'react'
import AppBar from '@mui/material/AppBar'

import Toolbar from '@mui/material/Toolbar'

import {IconButton, Typography, useTheme} from '@mui/material'
import { useAppDispatch } from "@formswizard/state"
import { Box } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { toggleColorMode } from "@formswizard/state"
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
export function MainAppBar() {
  const dispatch = useAppDispatch()

  return (
    <AppBar position="fixed"  sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Grid2 container flex={1} alignItems="center">
          <Grid2 md={6}>
            <Typography variant="h6" noWrap component="div">
              Forms Designer
            </Typography>
          </Grid2>
          <Grid2 md={3} sx={{ flexWrap: 'nowrap', display: 'flex' }}>
            {/*tools?*/}
          </Grid2>
          <Grid2
            md={3}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              ' > *': {
                mr: 2,
              },
              ' > button': {
                mr: 2,
              },
            }}
          >
            <DarkModeSwitch></DarkModeSwitch>
          </Grid2>
        </Grid2>
      </Toolbar>
    </AppBar>
  )
}


function DarkModeSwitch() {
  const theme = useTheme()

  const dispatch = useAppDispatch()
  const handleClicked = () => {
    dispatch(toggleColorMode())
  }
  return (
    <Box
      sx={{
        display: 'flex',

        alignItems: 'center',
        justifyContent: 'center',
        // bgcolor: 'background.default',
        // color: 'text.primary',
        borderRadius: 1,
        p: 1,
      }}
    >
      {theme.palette.mode} mode
      <IconButton sx={{ ml: 1 }} onClick={handleClicked} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  )
}
