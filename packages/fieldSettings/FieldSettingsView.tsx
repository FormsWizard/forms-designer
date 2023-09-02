import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {materialCells, materialRenderers} from '@jsonforms/material-renderers'
import {JsonForms} from '@jsonforms/react'
import {useToolSettings} from './useFieldSettings'
import {Box, Button, Grid, IconButton, TextField, ToggleButton, Toolbar, Typography} from '@mui/material'
import * as Icons from '@mui/icons-material'
import {renameField, selectElement, selectSelectedElementJsonSchema, useAppDispatch, useAppSelector} from "@formswizard/state";
import {pathToPathSegments} from "@formswizard/utils";
import {ToolSetting} from "./ToolSettingType";

type FieldSettingsViewProps = {
  additionalToolSettings?: ToolSetting[];
}

/**
 * from a given path foo.bar.baz returns baz and foo.bar
 * @param path
 */
const splitLastPath: (path: string) => ([string | undefined, string | undefined]) = (path: string) => {
  const segments = pathToPathSegments(path)
  if (segments.length <= 0) return [undefined, undefined]
  const rest = segments.slice(0, segments.length - 1)
  const restPath = rest.length <= 0 ? undefined : rest.join('.')
  return [segments[segments.length - 1], restPath]
}

export const filterUndefOrNull = <T, >(
    ts?: (T | undefined | null)[] | null
): T[] =>
    ts?.filter(
        (t: T | undefined | null): t is T => t !== undefined && t !== null
    ) || []

export function FieldSettingsView({additionalToolSettings}: FieldSettingsViewProps) {
  const dispatch = useAppDispatch()
  const {handleChange, toolSettingsJsonSchema, tooldataBuffer, selectedKey, selectedElementJsonSchema} = useToolSettings({additionalToolSettings})
  const [showKeyEditor, setShowKeyEditor] = useState(false);
  const [newKey, setNewKey] = useState<string>('')
  const key = useMemo(() => {
    const [lastPathSegment] = splitLastPath(selectedKey || '')
    return lastPathSegment
  }, [selectedKey])

  const keyIsEditable = Boolean(selectedElementJsonSchema && selectedElementJsonSchema.type !== 'object')
  useEffect(() => {
    if (key === undefined) return
    setNewKey(key)
  }, [key])

  const toggleKeyEditor = useCallback(() => {
    setShowKeyEditor(!showKeyEditor)
  }, [showKeyEditor])

  const handleKeyChange = useCallback(() => {
      if (!selectedKey || selectedKey.length <= 0) return
      const [lastPathSegment, path] = splitLastPath(selectedKey)
      if (lastPathSegment === undefined) return
      dispatch(selectElement(undefined))
      dispatch(renameField({path: selectedKey, newFieldName: newKey}))
      const newPath = filterUndefOrNull([path, newKey]).join('.')
      dispatch(selectElement(newPath))


  }, [newKey, selectedKey])

  return (
      <>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Settings for {key || ''}
            {keyIsEditable && <IconButton onClick={toggleKeyEditor}>{showKeyEditor ? <Icons.EditOff /> : <Icons.Edit /> }</IconButton>}
          </Typography>
        </Toolbar>
        <Grid container direction={'column'} spacing={2} sx={{m: 2}}>
          {
              showKeyEditor && <Grid item>
                  <TextField placeholder={'Key name'} value={newKey} onChange={(e) => setNewKey(e.target.value)} label="Key"/>
                  <Button onClick={handleKeyChange}>ok</Button>
          </Grid>
          }
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
