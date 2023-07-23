import * as React from 'react'
import AppBar from '@mui/material/AppBar'

import Toolbar from '@mui/material/Toolbar'

import Typography from '@mui/material/Typography'
import { IconButton, Switch, useTheme } from '@mui/material'
import { selectEditMode, toggleEditMode } from '../wizard/WizardSlice'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from '../../app/hooks/reduxHooks'
import { FormattedMessage } from 'react-intl'
import LanguageSelector from './LanguageDropdown'
import { Box } from '@mui/system'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { toggleColorMode } from './AppBarSlice'
import { TemplateModalButton } from '../Templates/TemplateModal'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
function MainAppBar() {
  const dispatch = useAppDispatch()

  const editMode = useSelector(selectEditMode)
  const handleToggleEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleEditMode())
  }

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Grid2 container flex={1} alignItems="center">
          <Grid2 md={6}></Grid2>
          <Grid2 md={3} sx={{ flexWrap: 'nowrap', display: 'flex' }}>
            <Typography variant="h6" noWrap component="div">
              <FormattedMessage id="editMode"></FormattedMessage>
            </Typography>
            <Switch checked={editMode} onChange={handleToggleEdit} />
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
            <TemplateModalButton>Templates</TemplateModalButton>
            <LanguageSelector></LanguageSelector>
          </Grid2>
        </Grid2>
      </Toolbar>
    </AppBar>
  )
}

export default MainAppBar

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
