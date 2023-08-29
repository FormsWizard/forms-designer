import React, { FunctionComponent } from 'react'
import { Box, Container, Drawer, Paper, Toolbar, Typography } from '@mui/material'
import { Wizard } from './Wizard'
import { Toolbox } from '@formswizard/toolbox'
import { FieldSettingsView } from '@formswizard/fieldsettings'
import { MainAppBar } from './layout/MainAppBar'
import { TrashFAB } from './components'
import { getpreviewModus, useAppDispatch } from '@formswizard/state'

interface OwnProps {}

type Props = OwnProps

const drawerWidth = 240
export const MainLayout: FunctionComponent<Props> = (props) => {
  return (
    <>
      <MainAppBar />
      <Drawer
        variant="persistent"
        anchor="left"
        open
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
        <Toolbox />
      </Drawer>
      <Container maxWidth="md">
        <Toolbar />
        <Paper sx={{ p: 4, m: 4 }} elevation={12} square>
          <Wizard />
        </Paper>
        <TrashFAB />
      </Container>
      <Drawer
        variant="persistent"
        anchor="right"
        open
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar></Toolbar>

        <FieldSettingsView></FieldSettingsView>
      </Drawer>
    </>
  )
}
