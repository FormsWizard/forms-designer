import React from 'react'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import { useModal } from '@ebay/nice-modal-react'

export default function DialogNiceModalWrapper({
  children,
  modal,
  TransitionComponent,
  ...props
}: {
  children: React.ReactNode
  modal: ReturnType<typeof useModal>
  TransitionComponent: React.ComponentType<React.PropsWithChildren<unknown>>
  props?: DialogProps
}) {
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
