import type { ComponentClass, FunctionComponent } from 'react'
import { LabelProps, OwnPropsOfLabel, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core'
import { withJsonFormsLabelProps } from '@jsonforms/react'
import { Typography, Alert } from '@mui/material'

/**
 * Default tester for a label.
 * @type {RankedTester}
 */
export const materialAlertRendererTester: RankedTester = rankWith(1, uiTypeIs('Alert'))

/**
 * Default renderer for a label.
 */
export const MaterialAlertRenderer = ({ text, visible }: LabelProps) => {
  // @ts-ignore
  if (!visible) {
    return null
  }
  return (
      <Alert severity="info">
        <Typography variant="h6">{text}</Typography>
      </Alert>
  )
}

const MaterialAlertRendererWithProps: ComponentClass<OwnPropsOfLabel> | FunctionComponent<OwnPropsOfLabel> =
  withJsonFormsLabelProps(MaterialAlertRenderer) as FunctionComponent<OwnPropsOfLabel>
export default MaterialAlertRendererWithProps
