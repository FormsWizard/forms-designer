import React from 'react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import { useToolSettings } from './useFieldSettings'
import { Box, Toolbar, Typography } from '@mui/material'

export function FieldSettingsView() {
  const { handleChange, toolSettingsJsonSchema, tooldataBuffer, selectedKey } = useToolSettings()

  return (
    <>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Settings for {selectedKey || ''}
        </Typography>
      </Toolbar>
      <Box sx={{ m: 2 }}>
        {!!toolSettingsJsonSchema && !!tooldataBuffer && (
          <JsonForms
            data={tooldataBuffer}
            schema={toolSettingsJsonSchema}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={handleChange}
          />
        )}
      </Box>
    </>
  )
}
