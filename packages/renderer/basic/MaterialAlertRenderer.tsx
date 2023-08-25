import React from 'react'
import { LabelProps, OwnPropsOfLabel, RankedTester, rankWith, uiTypeIs } from '@jsonforms/core'
import { withJsonFormsLabelProps } from '@jsonforms/react'
import { Hidden, Typography, Alert } from '@mui/material'

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
  return (
    <Hidden xsUp={!visible}>
      <Alert severity="info">
        <Typography variant="h6">{text}</Typography>
      </Alert>
    </Hidden>
  )
}

const MaterialAlertRendererWithProps: React.ComponentClass<OwnPropsOfLabel> | React.FunctionComponent<OwnPropsOfLabel> =
  withJsonFormsLabelProps(MaterialAlertRenderer) as React.FunctionComponent<OwnPropsOfLabel>
export default MaterialAlertRendererWithProps
