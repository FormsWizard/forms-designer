'use client'

import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  Box,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined'
import SettingsIcon from '@mui/icons-material/Settings'
import NoteAdd from '@mui/icons-material/NoteAdd'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import TouchAppIcon from '@mui/icons-material/TouchApp'
import MouseIcon from '@mui/icons-material/Mouse'
import Brightness7 from '@mui/icons-material/Brightness7'
import Brightness4 from '@mui/icons-material/Brightness4'
import {
  useAppDispatch,
  useAppSelector,
  toggleColorMode,
  selectPreviewModus,
  resetWizard,
  clearPersistedJsonFormsEditState,
} from '@formswizard/state'
import { useFinalizedToolSettings } from '@formswizard/fieldsettings'
import { useDesignerTranslation } from '@formswizard/i18n'
import { i18nInstance } from '@formswizard/i18n'
import { useTheme } from '@mui/material/styles'
import { PreviewModeToggle } from './MainAppBar'
import { ExportSchemaModal, InterfaceModeReloadDialog } from '../components'
import { useInterfaceMode, type InterfaceMode } from '../context'

export interface MobileAppBarProps {
  leftDrawerOpen: boolean
  onToggleLeftDrawer: () => void
  rightDrawerOpen: boolean
  onToggleRightDrawer: () => void
}

export function MobileAppBar({
  leftDrawerOpen,
  onToggleLeftDrawer,
  rightDrawerOpen,
  onToggleRightDrawer,
}: MobileAppBarProps) {
  const { t } = useDesignerTranslation()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const previewModus = useAppSelector(selectPreviewModus)
  const { selectedPath } = useFinalizedToolSettings()
  const { interfaceMode, setInterfaceMode } = useInterfaceMode()

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [interfaceDialogOpen, setInterfaceDialogOpen] = useState(false)
  const [pendingMode, setPendingMode] = useState<InterfaceMode | null>(null)

  const showLeftDrawerToggle = !previewModus
  const showRightDrawerToggle = Boolean(selectedPath) && !previewModus

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleResetForm = () => {
    handleMenuClose()
    if (window.confirm(t('appBar.resetConfirm'))) {
      clearPersistedJsonFormsEditState()
      dispatch(resetWizard())
    }
  }

  const handleExportClick = () => {
    handleMenuClose()
    setExportModalOpen(true)
  }

  const handleInterfaceModeClick = (mode: InterfaceMode) => {
    if (mode === interfaceMode || mode === 'click-based') return
    setPendingMode(mode)
    setInterfaceDialogOpen(true)
  }

  const handleInterfaceDialogClose = () => {
    setInterfaceDialogOpen(false)
    setPendingMode(null)
  }

  const handleInterfaceDialogConfirm = () => {
    if (pendingMode) {
      setInterfaceMode(pendingMode)
    }
    setInterfaceDialogOpen(false)
    setPendingMode(null)
  }

  const handleDarkModeToggle = () => {
    dispatch(toggleColorMode())
  }

  return (
    <>
      <AppBar position="sticky" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between', minHeight: { xs: 48 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 48 }}>
            {showLeftDrawerToggle && (
              <IconButton
                color="inherit"
                aria-label={t('appBar.toolbox')}
                onClick={onToggleLeftDrawer}
                edge="start"
              >
                <BuildCircleOutlinedIcon />
              </IconButton>
            )}
          </Box>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <PreviewModeToggle />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 48, justifyContent: 'flex-end' }}>
            {showRightDrawerToggle && (
              <IconButton
                color="inherit"
                aria-label={t('appBar.settings')}
                onClick={onToggleRightDrawer}
              >
                <SettingsIcon />
              </IconButton>
            )}
            <IconButton
              color="inherit"
              aria-label={t('appBar.menu')}
              onClick={handleMenuOpen}
              edge="end"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 220 } } }}
      >
        <MenuItem onClick={handleResetForm}>
          <ListItemIcon>
            <NoteAdd fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('appBar.newForm')} />
        </MenuItem>
        <MenuItem onClick={handleExportClick}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('appBar.exportSchema')} />
        </MenuItem>
        <Divider />
        <MenuItem disabled sx={{ opacity: 1 }}>
          <ListItemText primary={t('appBar.interfaceMode')} secondary={interfaceMode === 'touch-drag' ? 'Touch' : 'Mouse'} />
        </MenuItem>
        <MenuItem onClick={() => handleInterfaceModeClick('touch-drag')}>
          <ListItemIcon>
            <TouchAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Touch" />
        </MenuItem>
        <MenuItem onClick={() => handleInterfaceModeClick('mouse-drag')}>
          <ListItemIcon>
            <MouseIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mouse" />
        </MenuItem>
        <Divider />
        <MenuItem disabled sx={{ opacity: 1 }}>
          <ListItemText primary={t('appBar.language')} secondary={i18nInstance.language.toUpperCase()} />
        </MenuItem>
        <MenuItem onClick={() => { i18nInstance.changeLanguage('en'); handleMenuClose(); }}>
          <ListItemText primary="EN" />
        </MenuItem>
        <MenuItem onClick={() => { i18nInstance.changeLanguage('de'); handleMenuClose(); }}>
          <ListItemText primary="DE" />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleDarkModeToggle}
          disableRipple
          sx={{ gap: 1 }}
        >
          <ListItemIcon>
            {theme.palette.mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
          </ListItemIcon>
          <ListItemText primary={t('appBar.darkMode')} />
          <Switch
            size="small"
            checked={theme.palette.mode === 'dark'}
            onChange={handleDarkModeToggle}
            onClick={(e) => e.stopPropagation()}
          />
        </MenuItem>
      </Menu>

      <ExportSchemaModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} />

      <InterfaceModeReloadDialog
        open={interfaceDialogOpen}
        onClose={handleInterfaceDialogClose}
        onConfirm={handleInterfaceDialogConfirm}
        newMode={pendingMode || interfaceMode}
        currentMode={interfaceMode}
      />
    </>
  )
}
