import React, { useState } from 'react'
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
  Tooltip
} from '@mui/material'
import TouchAppIcon from '@mui/icons-material/TouchApp'
import MouseIcon from '@mui/icons-material/Mouse'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import { useInterfaceMode, InterfaceMode } from '../context'
import { InterfaceModeReloadDialog } from './InterfaceModeReloadDialog'

const interfaceModeConfig: Record<InterfaceMode, { label: string; icon: React.ReactNode }> = {
  'touch-drag': { 
    label: 'Touch', 
    icon: <TouchAppIcon fontSize="small" /> 
  },
  'mouse-drag': { 
    label: 'Mouse', 
    icon: <MouseIcon fontSize="small" /> 
  },
  'click-based': { 
    label: 'Click', 
    icon: <RadioButtonCheckedIcon fontSize="small" /> 
  }
}

export function InterfaceModeChooser() {
  const { interfaceMode, setInterfaceMode } = useInterfaceMode()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingMode, setPendingMode] = useState<InterfaceMode | null>(null)

  const handleChange = (event: SelectChangeEvent<InterfaceMode>) => {
    const newMode = event.target.value as InterfaceMode
    
    // If it's the same mode or click-based (disabled), do nothing
    if (newMode === interfaceMode || newMode === 'click-based') {
      return
    }
    
    // Show dialog for confirmation
    setPendingMode(newMode)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setPendingMode(null)
  }

  const handleDialogConfirm = () => {
    if (pendingMode) {
      setInterfaceMode(pendingMode) // This will reload the page
    }
    setDialogOpen(false)
    setPendingMode(null)
  }

  const currentConfig = interfaceModeConfig[interfaceMode]

  return (
    <Box>
      <Tooltip 
        title={`${currentConfig.label} mode`}
        placement="left"
        enterDelay={1000}
        leaveDelay={0}
      >
        <FormControl size="small">
          <Select
            value={interfaceMode}
            // @ts-ignore
            onChange={handleChange}
            displayEmpty
            sx={{
              color: 'inherit',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minHeight: 'auto',
              },
            }}
          >
            {Object.entries(interfaceModeConfig).map(([mode, config]) => (
              <MenuItem 
                key={mode} 
                value={mode as InterfaceMode}
                disabled={mode === 'click-based'}
              >
                {config.icon}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {config.label}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Tooltip>

      <InterfaceModeReloadDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        newMode={pendingMode || interfaceMode}
        currentMode={interfaceMode}
      />
    </Box>
  )
}
