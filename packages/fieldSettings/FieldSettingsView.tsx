import React, { useMemo } from 'react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import useToolSettings from './useFieldSettings'
import { Box, Container, Drawer, Paper, Toolbar, Typography } from '@mui/material'

export function FieldSettingsView() {
  const { handleChange, toolSettingsJsonSchema, tooldataBuffer } = useToolSettings()

  return (
    <>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Field Settings
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
