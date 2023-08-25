import * as React from 'react'

import { IconButton, Typography, useTheme, AppBar, Toolbar, Box, Grid } from '@mui/material'
import { useAppDispatch } from '@formswizard/state'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { toggleColorMode } from '@formswizard/state'
export function MainAppBar() {
  const dispatch = useAppDispatch()

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Grid container flex={1} alignItems="center">
          <Grid item md={6}>
            <Typography variant="h6" noWrap component="div">
              Forms Designer
            </Typography>
          </Grid>
          <Grid item md={3} sx={{ flexWrap: 'nowrap', display: 'flex' }}>
            {/*tools?*/}
          </Grid>
          <Grid
            md={3}
            item
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
            {/*<DarkModeSwitch></DarkModeSwitch>*/}
          </Grid>
        </Grid>
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
        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Box>
  )
}
