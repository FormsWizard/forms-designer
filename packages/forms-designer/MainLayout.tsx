'use client'
import React, { FunctionComponent, useRef } from 'react'
import { Box, Button, Container, Drawer, Paper, Toolbar, Typography } from '@mui/material'
import { Wizard } from './Wizard'
import { Toolbox } from '@formswizard/toolbox'
import { FieldSettingsView } from '@formswizard/fieldsettings'
import { MainAppBar } from './layout/MainAppBar'
import { TrashFAB } from './components'
import { selectPreviewModus, togglePreviewModus, useAppDispatch, useAppSelector } from '@formswizard/state'
import useAutoDeselectOnOutsideClick from './useAutoDeselectOnOutsideClick'

interface OwnProps {}

type Props = OwnProps

const drawerWidth = 240
export const MainLayout: FunctionComponent<Props> = (props) => {
  const wizardPaperRef = useRef<null | HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const previewModus = useAppSelector(selectPreviewModus)
  const handleTogglePreview = (event: any) => {
    dispatch(togglePreviewModus())
  }
  const { handleClickOutside } = useAutoDeselectOnOutsideClick(wizardPaperRef)
  return (
    <>
      <Box component={'main'} sx={{ display: 'flex', flexGrow: 1, minHeight: '100vh' }} onClick={handleClickOutside}>
        <MainAppBar />
        {previewModus && (
          <Button color="warning" onClick={handleTogglePreview} size="large">
            <span style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>disable preview mode</span>
          </Button>
        )}
        <Drawer
          variant="persistent"
          anchor="left"
          open={!previewModus}
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
          <Paper sx={{ p: 4, m: 4 }} elevation={12} square ref={wizardPaperRef}>
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
      </Box>
    </>
  )
}
