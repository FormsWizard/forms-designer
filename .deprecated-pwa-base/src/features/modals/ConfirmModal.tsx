import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'

import NiceModal, { useModal } from '@ebay/nice-modal-react'

import { FormattedMessage } from 'react-intl'

import DialogNiceModalWrapper from './modalUtils/DialogNiceModalWrapper'
import { SlideTransition } from './modalUtils/ModalTransitions'

interface ConfirmModalProps {
  onConfirm?: () => void
  onReject?: () => void
}

const ConfirmModal = NiceModal.create<ConfirmModalProps>(({ onConfirm = () => null, onReject = () => null }) => {
  const modal = useModal()

  const handleAgree = () => {
    modal.hide()
    onConfirm()
  }
  const handleDisagree = () => {
    modal.hide()
    onReject()
  }
  return (
    //@ts-ignore
    <DialogNiceModalWrapper modal={modal} TransitionComponent={SlideTransition} onClose={() => modal.hide()}>
      <DialogTitle id="alert-dialog-slide-title">
        <FormattedMessage
          description="confirm modal header"
          defaultMessage="Attention"
          id={'confirmModal_headerText'}
        ></FormattedMessage>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <FormattedMessage
            description="confirm modal header"
            defaultMessage="are you sure you want to continue?"
            id={'confirmModal_bodyText'}
          ></FormattedMessage>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree} color="primary">
          <FormattedMessage
            description="confirm modal header"
            defaultMessage="cancel"
            id={'confirmModal_cancelButton'}
          ></FormattedMessage>
        </Button>
        <Button onClick={handleAgree} color="warning" variant="contained">
          <FormattedMessage
            description="confirm modal header"
            defaultMessage="continue"
            id={'confirmModal_confirmButton'}
          ></FormattedMessage>
        </Button>
      </DialogActions>
    </DialogNiceModalWrapper>
  )
})

export function ConfirmButton({
  onConfirm = () => null,
  onReject = () => null,
  children,
  ...props
}: ConfirmModalProps & { children: React.ReactNode }) {
  return (
    <Button
      onClick={() =>
        NiceModal.show(ConfirmModal, {
          onConfirm,
          onReject,
        })
      }
      {...props}
    >
      {children}
    </Button>
  )
}

export function confirmHandler({ onConfirm, onReject }: ConfirmModalProps) {
  NiceModal.show(ConfirmModal, {
    onConfirm,
    onReject,
  })
}
