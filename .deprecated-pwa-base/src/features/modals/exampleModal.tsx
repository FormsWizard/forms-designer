import React from 'react'
import Button from '@mui/material/Button'

import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import NiceModal, { useModal } from '@ebay/nice-modal-react'

import { FormattedMessage } from 'react-intl'
import { SlideTransition } from './modalUtils/ModalTransitions'
import DialogNiceModalWrapper from './modalUtils/DialogNiceModalWrapper'

const ExampleModal = NiceModal.create(() => {
  const modal = useModal()

  return (
    <DialogNiceModalWrapper modal={modal} TransitionComponent={SlideTransition}>
      <DialogTitle id="alert-dialog-slide-title">
        <FormattedMessage description="ModalHeader" defaultMessage="header" id="confirmModal_header"></FormattedMessage>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <FormattedMessage
            description="confirm modal message"
            defaultMessage="modal message"
            id="confirmModal_message"
          ></FormattedMessage>
        </DialogContentText>
      </DialogContent>
      <DialogActions>{/* actions */}</DialogActions>
    </DialogNiceModalWrapper>
  )
})

export function ExampeModalButton({ children, ...props }: { children: React.ReactNode }) {
  return (
    <Button onClick={() => NiceModal.show(ExampleModal)} {...props}>
      {children}
    </Button>
  )
}

// weitere exportfunktionen möglich, wie z.B.:  () => NiceModal.show(ExampleModal)
