import React, { useCallback, useMemo, useState } from 'react'
import { JsonFormsCore } from '@jsonforms/core'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { useAppSelector } from '../../app/hooks/reduxHooks'
import { selectEditMode, selectJsonSchema, selectUiSchema } from './WizardSlice'
import { Box } from '@mui/system'
import MainAppBar from '../AppBar/AppBar'
import { JsonForms } from '@jsonforms/react'
import VerticalLayoutWithDropZoneRenderer, {
  verticalLayoutTester,
} from '../../renderer/VerticalLayoutWithDropZoneRenderer'
import { horizontalLayoutTester } from '../../renderer/HorizontalLayoutWithDropZoneRenderer'
import HorizontalLayoutWithDropZoneRenderer from '../../renderer/HorizontalLayoutWithDropZoneRenderer'
import RightDrawer from '../home/RightDrawer'
import LeftDrawer from '../home/LeftDrawer'
import { extendUiSchemaWithPath } from '../../utils/uiSchemaHelpers'

const renderers = [
  ...materialRenderers,
  {
    tester: verticalLayoutTester,
    renderer: VerticalLayoutWithDropZoneRenderer,
  },
  {
    tester: horizontalLayoutTester,
    renderer: HorizontalLayoutWithDropZoneRenderer,
  },
]

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
  console.log({uiSchemaWithPath})
  return (
    <Box component={'main'} sx={{ display: 'flex', flexGrow: 1, p: 3, mt: 8 }}>
      <MainAppBar></MainAppBar>
      <LeftDrawer></LeftDrawer>
      <JsonForms
        data={data}
        renderers={renderers}
        cells={materialCells}
        onChange={handleFormChange}
        schema={jsonSchema}
        uischema={uiSchemaWithPath}
        readonly={editMode}
      />
      <RightDrawer></RightDrawer>
    </Box>
  )
}

export default Wizard
