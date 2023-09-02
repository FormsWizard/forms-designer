import React from 'react'
import Button from '@mui/material/Button'

import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import NiceModal, { useModal } from '@ebay/nice-modal-react'

import { FormattedMessage } from 'react-intl'
import DialogNiceModalWrapper from '../modals/modalUtils/DialogNiceModalWrapper'
import { CollapseTransition, SlideTransition } from '../modals/modalUtils/ModalTransitions'
import TemplateModalContent from './TemplateModalContent'
import { FormControlLabel, Paper, TextField, Typography } from '@mui/material'

import { Box, Stack } from '@mui/system'

import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
const TemplateModal = NiceModal.create(() => {
  const modal = useModal()

  return (
    <DialogNiceModalWrapper
      modal={modal}
      TransitionComponent={SlideTransition}
      fullScreen
      sx={{ padding: 4 }}
      onClose={() => modal.hide()}
    >
      <DialogTitle>
        <Paper>
          <Grid2 container sx={{ minHeight: 100 }}>
            <Grid2 md={2} sx={{ display: 'flex' }}>
              <Box sx={{ textAlign: 'center', margin: 'auto' }}>
                <Typography variant="h5">name your Template</Typography>{' '}
              </Box>
            </Grid2>
            <Grid2 md={4} sx={{ display: 'flex' }}>
              <Box sx={{ textAlign: 'center', margin: 'auto', flex: 1 }}>
                <TextField fullWidth></TextField>
              </Box>
            </Grid2>
          </Grid2>
        </Paper>
      </DialogTitle>
      <DialogContent>
        <TemplateModalContent></TemplateModalContent>
      </DialogContent>
      <DialogActions>{/* actions */}</DialogActions>
    </DialogNiceModalWrapper>
  )
})

export function TemplateModalButton({ children, ...props }: { children: React.ReactNode }) {
  return (
    <Button onClick={() => NiceModal.show(TemplateModal)} {...props}>
      {children}
    </Button>
  )
}

// weitere exportfunktionen möglich, wie z.B.:  () => NiceModal.show(ExampleModal)
