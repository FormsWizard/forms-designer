import { useCallback, useMemo, useState } from 'react'
import { JsonForms } from '@jsonforms/react'
import { useJsonSchema } from '@formswizard/state'
import { selectUiSchema, useAppSelector, selectPreviewModus } from '@formswizard/state'
import { extendUiSchemaWithPath } from '@formswizard/utils'
import { JsonSchema as JsonFormsJsonSchema } from '@jsonforms/core'
import { useDragScrolling } from '@formswizard/react-hooks'
import { Box, BoxProps } from '@mui/material'
import { usePreparedJsonFormsState } from '@formswizard/tool-context'
import { dropRenderer } from '@formswizard/designer-renderer'


export type WizardProps = BoxProps

export function Wizard(props: WizardProps) {
  const [data, setData] = useState({})
  const previewModus = useAppSelector(selectPreviewModus)

  const { renderers, cells, ajv, i18n } = usePreparedJsonFormsState({
    isPreview: previewModus,
    editingRenderers: dropRenderer,
  })

  const handleFormChange = useCallback(({ data }: { data: any }) => setData(data), [setData])
  const schema = useJsonSchema()

  const uiSchema = useAppSelector(selectUiSchema)
  const uiSchemaWithPath = useMemo(() => extendUiSchemaWithPath(uiSchema), [uiSchema])

  useDragScrolling()

  return (
    <Box {...props}>
      <JsonForms
        data={data}
        onChange={handleFormChange}
        schema={schema as JsonFormsJsonSchema}
        uischema={uiSchemaWithPath}
        readonly={!previewModus}
        {...{ renderers, cells, ajv, i18n }}
      />
    </Box>
  )
}
