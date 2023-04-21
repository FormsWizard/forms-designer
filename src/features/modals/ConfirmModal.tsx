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
  confirmButtonTextID?: string
  cancelButtonTextID?: string
  modalBodyTextID?: string
  modalHeaderTextID?: string
}

const ConfirmModal = NiceModal.create<ConfirmModalProps>(
  ({
    onConfirm = () => null,
    onReject = () => null,
    confirmButtonTextID,
    cancelButtonTextID,
    modalBodyTextID,
    modalHeaderTextID,
  }) => {
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
            id={modalHeaderTextID}
          ></FormattedMessage>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <FormattedMessage
              description="confirm modal header"
              defaultMessage="are you sure you want to continue?"
              id={modalBodyTextID}
            ></FormattedMessage>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree} color="primary">
            <FormattedMessage
              description="confirm modal header"
              defaultMessage="cancel"
              id={cancelButtonTextID}
            ></FormattedMessage>
          </Button>
          <Button onClick={handleAgree} color="warning" variant="contained">
            <FormattedMessage
              description="confirm modal header"
              defaultMessage="continue"
              id={confirmButtonTextID}
            ></FormattedMessage>
          </Button>
        </DialogActions>
      </DialogNiceModalWrapper>
    )
  }
)

export function ConfirmButton({
  onConfirm = () => null,
  onReject = () => null,
  confirmButtonTextID = 'confirmModal_confirmButton',
  cancelButtonTextID = 'confirmModal_cancelButton',
  modalBodyTextID = 'confirmModal_bodyText',
  modalHeaderTextID = 'confirmModal_headerText',
  children,
  ...props
}: ConfirmModalProps & { children: React.ReactNode }) {
  return (
    <Button
      onClick={() =>
        NiceModal.show(ConfirmModal, {
          onConfirm,
          onReject,
          confirmButtonTextID,
          cancelButtonTextID,
          modalBodyTextID,
          modalHeaderTextID,
        })
      }
      {...props}
    >
      {children}
    </Button>
  )
}

export function confirmHandler({
  onConfirm,
  onReject,
  confirmButtonTextID = 'confirmModal_confirmButton',
  cancelButtonTextID = 'confirmModal_cancelButton',
  modalBodyTextID = 'confirmModal_bodyText',
  modalHeaderTextID = 'confirmModal_headerText',
}: ConfirmModalProps) {
  NiceModal.show(ConfirmModal, {
    onConfirm,
    onReject,
    confirmButtonTextID,
    cancelButtonTextID,
    modalBodyTextID,
    modalHeaderTextID,
  })
}
