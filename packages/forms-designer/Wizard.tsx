import React, { useCallback, useMemo, useState } from 'react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import { selectJsonSchema, selectUiSchema, useAppSelector, selectPreviewModus } from '@formswizard/state'
import { extendUiSchemaWithPath } from '@formswizard/utils'
import { basicRenderer } from '@formswizard/designer-basic-renderer'
import {
  horizontalLayoutTester,
  HorizontalLayoutWithDropZoneRenderer,
  verticalLayoutTester,
  VerticalLayoutWithDropZoneRenderer,
} from '@formswizard/designer-renderer'
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core'
import { useDragScrolling } from '@formswizard/react-hooks'
import { Box } from '@mui/material'

const additionalRenderers = [
  {
    tester: verticalLayoutTester,
    renderer: VerticalLayoutWithDropZoneRenderer,
  },
  {
    tester: horizontalLayoutTester,
    renderer: HorizontalLayoutWithDropZoneRenderer,
  },
]

const renderers: JsonFormsRendererRegistryEntry[] = [...materialRenderers, ...additionalRenderers, ...basicRenderer]
const previewRenderers: JsonFormsRendererRegistryEntry[] = [...materialRenderers, ...basicRenderer]
export function Wizard() {
  const [data, setData] = useState({})

  const handleFormChange = useCallback(({ data }: { data: any }) => setData(data), [setData])
  const jsonSchema = useAppSelector(selectJsonSchema)
  const uiSchema = useAppSelector(selectUiSchema)
  const uiSchemaWithPath = useMemo(() => extendUiSchemaWithPath(uiSchema), [uiSchema])
  const previewModus = useAppSelector(selectPreviewModus)
  useDragScrolling()
  return (
    <Box>
      <JsonForms
        data={data}
        renderers={previewModus ? previewRenderers : renderers}
        cells={materialCells}
        onChange={handleFormChange}
        schema={jsonSchema}
        uischema={uiSchemaWithPath}
        readonly={!previewModus}
      />
    </Box>
  )
}
