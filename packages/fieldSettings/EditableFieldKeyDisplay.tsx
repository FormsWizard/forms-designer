import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import { useToolSettings } from './useFieldSettings'
import { Box, Button, Grid, IconButton, TextField, ToggleButton, Toolbar, Typography } from '@mui/material'
import * as Icons from '@mui/icons-material'
import { renameField, useAppDispatch } from '@formswizard/state'
import { pathToPathSegments, splitLastPath, filterNullOrUndef } from '@formswizard/utils'
import { ToolSetting } from './ToolSettingType'
import { useWizardSelection } from './useWizardSelection'

function EditableFieldKeyDisplay() {
  const dispatch = useAppDispatch()
  const { selectedKeyName, selectedPath, selectionDisplayName } = useWizardSelection()

  const [showKeyEditor, setShowKeyEditor] = useState(false)
  const [newKey, setNewKey] = useState<string>('')

  const keyIsEditable = Boolean(selectedKeyName)
  useEffect(() => {
    if (typeof selectedKeyName !== 'string') return
    setNewKey(selectedKeyName)
  }, [selectedKeyName])

  const toggleKeyEditor = useCallback(() => {
    setShowKeyEditor(!showKeyEditor)
  }, [showKeyEditor])

  const handleKeyChange = useCallback(() => {
    if (typeof selectedPath !== 'string') return
    dispatch(renameField({ path: selectedPath, newFieldName: newKey }))
    setShowKeyEditor(false)
  }, [newKey, selectedPath])
  return (
    <>
      <Typography variant="h6" component="div">
        Settings for
        {!showKeyEditor && (
          <>
            <span> {selectionDisplayName}</span>
            {keyIsEditable && (
              <IconButton onClick={toggleKeyEditor}>{showKeyEditor ? <Icons.EditOff /> : <Icons.Edit />}</IconButton>
            )}
          </>
        )}
        {showKeyEditor && (
          <Grid item>
            <TextField
              placeholder={'Key name'}
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              label="Key"
            />
            <Button onClick={handleKeyChange}>ok</Button>
          </Grid>
        )}
      </Typography>
    </>
  )
}

export default EditableFieldKeyDisplay
