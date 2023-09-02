import React from 'react'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { Collapse } from '@mui/material'

export const SlideTransition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})
export const CollapseTransition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Collapse ref={ref} {...props} />
})
