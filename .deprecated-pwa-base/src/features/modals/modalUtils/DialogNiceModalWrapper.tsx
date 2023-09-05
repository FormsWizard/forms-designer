import React from 'react'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import { useModal } from '@ebay/nice-modal-react'
import { type } from 'os'

type OwnProps = {
  children: React.ReactNode
  modal: ReturnType<typeof useModal>
  TransitionComponent: React.ComponentType<React.PropsWithChildren<unknown>>
}

type Props = OwnProps & Partial<DialogProps>

export default function DialogNiceModalWrapper({ children, modal, TransitionComponent, ...props }: Props) {
  return (
    <Dialog
      TransitionComponent={TransitionComponent}
      open={modal.visible}
      TransitionProps={{
        onExited: () => modal.remove(),
      }}
      {...props}
    >
      {children}
    </Dialog>
  )
}
