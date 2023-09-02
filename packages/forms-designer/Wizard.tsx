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


export type WizardProps = {
  renderers?: JsonFormsRendererRegistryEntry[]
}
export function Wizard({renderers = []}: WizardProps) {
  const [data, setData] = useState({})

  const handleFormChange = useCallback(({ data }: { data: any }) => setData(data), [setData])
  const jsonSchema = useAppSelector(selectJsonSchema)
  const uiSchema = useAppSelector(selectUiSchema)
  const uiSchemaWithPath = useMemo(() => extendUiSchemaWithPath(uiSchema), [uiSchema])
  const previewModus = useAppSelector(selectPreviewModus)
  const finalRenderers: JsonFormsRendererRegistryEntry[] =  useMemo(() => [...materialRenderers, ...additionalRenderers, ...basicRenderer, ...renderers], [additionalRenderers, basicRenderer, materialRenderers, renderers])
  const previewRenderers: JsonFormsRendererRegistryEntry[] = useMemo(() =>  [...materialRenderers, ...basicRenderer, ...renderers], [basicRenderer, materialRenderers, renderers])
  useDragScrolling()
  return (
    <Box>
      <JsonForms
        data={data}
        renderers={previewModus ? previewRenderers : finalRenderers}
        cells={materialCells}
        onChange={handleFormChange}
        schema={jsonSchema}
        uischema={uiSchemaWithPath}
        readonly={!previewModus}
      />
    </Box>
  )
}
