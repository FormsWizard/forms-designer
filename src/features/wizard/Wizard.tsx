import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { renderesDropping, renderesBasics } from '../../renderer/Renderers'
import { Container, Paper } from '@mui/material'
import { useScroll } from './useScroll'
import { useDragDropManager } from 'react-dnd'
import {TrashFAB} from "../TrashDroparea/TrashFAB";

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

  const uiSchemaWithPath = useMemo(() => extendUiSchemaWithPath(uiSchema), [uiSchema])
  const listRef = useRef<null | HTMLDivElement>(null)
  const { updatePosition } = useScroll(listRef)

  const dragDropManager = useDragDropManager()
  const monitor = dragDropManager.getMonitor()

  useEffect(() => {
    const unsubscribe = monitor.subscribeToOffsetChange(() => {
      const offset = monitor.getSourceClientOffset()?.y as number
      updatePosition(offset)
    })
    return unsubscribe
  }, [monitor, updatePosition])

  return (
    <Box component={'main'} sx={{ display: 'flex', flexGrow: 1, p: 3, mt: 8 }}>
      <MainAppBar></MainAppBar>
      <LeftDrawer></LeftDrawer>
      <Container maxWidth="md">
        <Paper sx={{ p: 4, m: 4 }} elevation={12} square>
          <JsonForms
            data={data}
            renderers={[...materialRenderers, ...renderesBasics, ...renderesDropping]}
            cells={materialCells}
            onChange={handleFormChange}
            schema={jsonSchema}
            uischema={uiSchemaWithPath}
            readonly={true}
          />
        </Paper>
      </Container>
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
      <TrashFAB />
    </Box>
  )
}

export default Wizard
