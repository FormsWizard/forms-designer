import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import type { JsonSchema as JsonFormsJsonSchema } from '@jsonforms/core'
import { useFinalizedToolSettings } from './useFieldSettings'
import { Box, Grid, Toolbar, IconButton } from '@mui/material'
import Close from '@mui/icons-material/Close'
import { selectPath, useAppDispatch } from '@formswizard/state'
import { useToolContext } from '@formswizard/tool-context'
import { useJsonFormsI18n } from '@formswizard/i18n'
import EditableFieldKeyDisplay from './EditableFieldKeyDisplay'

export function FieldSettingsView() {
  const { handleChange, toolSettingsJsonSchema, tooldataBuffer } = useFinalizedToolSettings()
  const dispatch = useAppDispatch()
  const { registeredCollections } = useToolContext()
  const i18n = useJsonFormsI18n(registeredCollections)

  const handleClose = () => {
    dispatch(selectPath(undefined))
  }

  return (
    <>
      <Toolbar sx={{ position: 'relative' }}>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          aria-label="close"
        >
          <Close fontSize="small" />
        </IconButton>
        <EditableFieldKeyDisplay></EditableFieldKeyDisplay>
      </Toolbar>
      <Grid container direction={'column'} spacing={2} sx={{ p: 2 }}>
        <Grid>
          <Box>
            {!!toolSettingsJsonSchema && !!tooldataBuffer && (
              <JsonForms
                data={tooldataBuffer}
                schema={toolSettingsJsonSchema as JsonFormsJsonSchema}
                renderers={materialRenderers}
                cells={materialCells}
                onChange={handleChange}
                i18n={i18n}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
