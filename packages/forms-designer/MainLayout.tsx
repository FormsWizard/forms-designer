import React, { FunctionComponent, useRef } from 'react'
import { Box, Button, Container, Drawer, Paper, Toolbar, Typography } from '@mui/material'
import { Wizard, WizardProps } from './Wizard'
import { Toolbox } from '@formswizard/toolbox'
import { FieldSettingsView, useToolSettings } from '@formswizard/fieldsettings'
import { MainAppBar } from './layout/MainAppBar'
import { TrashFAB } from './components'
import { selectPreviewModus, togglePreviewModus, useAppDispatch, useAppSelector } from '@formswizard/state'
import useAutoDeselectOnOutsideClick from './useAutoDeselectOnOutsideClick'
import { ToolSetting } from '@formswizard/types'

interface OwnProps {
  appBar?: React.ReactNode
  children?: React.ReactNode
  additionalToolSettings?: ToolSetting[]
}

type Props = OwnProps & Partial<WizardProps>

const drawerWidth = 240
export const MainLayout: FunctionComponent<Props> = ({ appBar, children, additionalToolSettings, ...wizardProps }) => {
  const wizardPaperRef = useRef<null | HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const previewModus = useAppSelector(selectPreviewModus)
  const { selectedPath } = useToolSettings()
  const handleTogglePreview = (event: any) => {
    dispatch(togglePreviewModus())
  }
  const { handleClickOutside } = useAutoDeselectOnOutsideClick(wizardPaperRef)
  return (
    <>
      <Box component={'main'} sx={{ display: 'flex', flexGrow: 1, minHeight: '100vh' }} onClick={handleClickOutside}>
        {appBar || <MainAppBar />}
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
          <Paper sx={{ p: 2, m: 4 }} elevation={12} square ref={wizardPaperRef}>
            {children ? (
              children
            ) : (
              <>
                <Wizard {...wizardProps} />
              </>
            )}
          </Paper>
        </Container>
        <Drawer
          variant="persistent"
          anchor="right"
          open={Boolean(Boolean(selectedPath) && !previewModus)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth + 100,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar></Toolbar>

          <FieldSettingsView additionalToolSettings={additionalToolSettings}></FieldSettingsView>
        </Drawer>
      </Box>
      <TrashFAB />
    </>
  )
}
