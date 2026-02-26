import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { InterfaceMode } from '../context'

interface InterfaceModeReloadDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  newMode: InterfaceMode
  currentMode: InterfaceMode
}

const modeLabels: Record<InterfaceMode, string> = {
  'touch-drag': 'Touch Drag',
  'mouse-drag': 'Mouse Drag',
  'click-based': 'Click Based'
}

export function InterfaceModeReloadDialog({
  open,
  onClose,
  onConfirm,
  newMode,
  currentMode
}: InterfaceModeReloadDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RefreshIcon color="warning" />
          <Typography variant="h6" component="span">
            Page Reload Required
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Switching from <strong>{modeLabels[currentMode]}</strong> to{' '}
            <strong>{modeLabels[newMode]}</strong> requires a page reload.
          </Typography>
        </Alert>
        
        <Typography variant="body2" color="text.secondary">
          Depending on the current deployment mode, your work may not be preserved.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="primary" 
          variant="contained"
          startIcon={<RefreshIcon />}
          autoFocus
        >
          Reload Page
        </Button>
      </DialogActions>
    </Dialog>
  )
}
