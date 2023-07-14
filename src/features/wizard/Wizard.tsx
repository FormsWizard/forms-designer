import React, { useCallback, useMemo, useState } from 'react'
import { JsonFormsCore } from '@jsonforms/core'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { useAppSelector } from '../../app/hooks/reduxHooks'
import { selectEditMode, selectJsonSchema, selectUiSchema } from './WizardSlice'
import { Box } from '@mui/system'
import MainAppBar from '../AppBar/AppBar'
import { JsonForms } from '@jsonforms/react'

import RightDrawer from '../home/RightDrawer'
import LeftDrawer from '../home/LeftDrawer'
import { extendUiSchemaWithPath } from '../../utils/uiSchemaHelpers'
import { FormControl, FormControlLabel, FormGroup, FormHelperText, Hidden } from '@mui/material'
import { CheckBox } from '@mui/icons-material'
import MaterialAlertRenderer, { materialAlertRendererTester } from '../../renderer/MaterialAlertRenderer'
import { renderesDropping, renderesBasics } from '../../renderer/Renderers'
import TrashDroparea from '../TrashDroparea/TrashDroparea'

function Wizard() {
  const [data, setData] = useState<any>({})
  const handleFormChange = useCallback(
    (state: Pick<JsonFormsCore, 'data' | 'errors'>) => {
      setData(state.data)
    },
    [setData]
  )
  const jsonSchema = useAppSelector(selectJsonSchema)
  const uiSchema = useAppSelector(selectUiSchema)
  const editMode = useAppSelector(selectEditMode)
  const uiSchemaWithPath = useMemo(() => extendUiSchemaWithPath(uiSchema), [uiSchema])

  return (
    <Box component={'main'} sx={{ display: 'flex', flexGrow: 1, p: 3, mt: 8 }}>
      <MainAppBar></MainAppBar>
      <LeftDrawer></LeftDrawer>
      <JsonForms
        data={data}
        renderers={[...materialRenderers, ...renderesBasics, ...renderesDropping]}
        cells={materialCells}
        onChange={handleFormChange}
        schema={jsonSchema}
        uischema={uiSchemaWithPath}
        readonly={editMode}
      />
      {/* <FormControlLabel
        label="aaaaaaaaaaaaaaa        sa    asa"
        labelPlacement="top"
        control={
          <FormControl component="fieldset" aria-label="123">
          <FormGroup row>
          {[1, 2, 3].map((option: any, index: number) => {
            return (
              <FormControlLabel
              id={option.value}
              key={option.value}
              control={<CheckBox key={'checkbox-' + option.value} />}
              label={option.label}
              />
              )
            })}
            </FormGroup>
          </FormControl>
        }
      ></FormControlLabel> */}
      <RightDrawer></RightDrawer>
<TrashDroparea></TrashDroparea>
    </Box>
  )
}

export default Wizard
