import { useCallback, useEffect, useState } from 'react'
import { Button, Grid, IconButton, TextField, Typography } from '@mui/material'
import EditOff from '@mui/icons-material/EditOff'
import Edit from '@mui/icons-material/Edit'
import { renameField, useAppDispatch } from '@formswizard/state'
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
        {!showKeyEditor && (
          <>
            <span> {selectionDisplayName}</span>
            {keyIsEditable && (
              <IconButton onClick={toggleKeyEditor}>{showKeyEditor ? <EditOff /> : <Edit />}</IconButton>
            )}
          </>
        )}
        {showKeyEditor && (
          <Grid>
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
