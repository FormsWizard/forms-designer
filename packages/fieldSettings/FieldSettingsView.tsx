import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import { useToolSettings } from './useFieldSettings'
import { Box, Button, Grid, IconButton, TextField, ToggleButton, Toolbar, Typography } from '@mui/material'
import EditableFieldKeyDisplay from './EditableFieldKeyDisplay'
import { ToolSetting } from '@formswizard/types'

type FieldSettingsViewProps = {
  additionalToolSettings?: ToolSetting[]
}

export function FieldSettingsView({ additionalToolSettings }: FieldSettingsViewProps) {
  const { handleChange, toolSettingsJsonSchema, tooldataBuffer } = useToolSettings({
    additionalToolSettings,
  })

  return (
    <>
      <Toolbar>
        <EditableFieldKeyDisplay></EditableFieldKeyDisplay>
      </Toolbar>
      <Grid container direction={'column'} spacing={2} sx={{ p: 2 }}>
        {/* {showKeyEditor && (
          <Grid item>
            <TextField
              placeholder={'Key name'}
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              label="Key"
            />
            <Button onClick={handleKeyChange}>ok</Button>
          </Grid>*/}
        {/* )} */}
        <Grid item>
          <Box>
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
        </Grid>
      </Grid>
    </>
  )
}
