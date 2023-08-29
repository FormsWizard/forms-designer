import * as React from 'react'

import { IconButton, Typography, useTheme, AppBar, Toolbar, Box, Grid, Switch } from '@mui/material'
import {
  useAppDispatch,
  toggleColorMode,
  togglePreviewModus,
  selectPreviewModus,
  useAppSelector,
} from '@formswizard/state'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
export function MainAppBar() {
  const dispatch = useAppDispatch()
  const previewModus = useAppSelector(selectPreviewModus)
  const handleTogglePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(togglePreviewModus())
  }
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Grid2 container flex={1} alignItems="center">
          <Grid2 md={6}></Grid2>
          <Grid2 md={3} sx={{ flexWrap: 'nowrap', display: 'flex' }}>
            <Typography variant="h6" noWrap component="div">
              preview
            </Typography>
            <Switch checked={previewModus} onChange={handleTogglePreview} />
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
            {/* <TemplateModalButton>Templates</TemplateModalButton> */}
            {/* <LanguageSelector></LanguageSelector> */}
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
        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Box>
  )
}
