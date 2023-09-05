import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import Toolbar from '@mui/material/Toolbar'

import { useSelector } from 'react-redux'
import {
  renameField,
  selectElement,
  selectJsonSchema,
  selectSelectedElementKey,
  selectUIElementFromSelection,
  updateUISchemaByScope,
} from '../wizard/WizardSlice'
import { Breadcrumbs, Divider, Grid, IconButton, TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Delete, Edit, NavigateNext, Save } from '@mui/icons-material'
import { useAppDispatch } from '../../app/hooks/reduxHooks'
import { pathSegmentsToScope } from '../../utils/uiSchemaHelpers'
import RecursiveTreeView, { RenderTree } from '../wizard/JSONSchemaTreeView'
import { JsonSchema7 } from '@jsonforms/core'
import { JsonForms } from '@jsonforms/react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'

import ToolSettings from '../ToolSettings/ToolSettingsView'

const drawerWidth = 240

export const FieldNameEditor: React.FC<{ path: string }> = ({ path }) => {
  const [newFieldName, setNewFieldName] = useState('')
  const [editMode, setEditMode] = useState(false)
  const dispatch = useAppDispatch()
  const pathSegments = useMemo(() => path?.split('.') || [], [path])

  useEffect(() => {
    const fieldName = pathSegments?.[pathSegments.length - 1]
    setNewFieldName(fieldName)
    setEditMode(false)
  }, [pathSegments, setNewFieldName, setEditMode])

  // const handleRemove = useCallback(() => {
  //   // @ts-ignore
  //   dispatch(removeFieldAndLayout({ path }))
  //   // @ts-ignore
  //   dispatch(selectElement(undefined))
  // }, [dispatch, path])
  const handleRenameOrSetEditMode = useCallback(() => {
    if (editMode) {
      const pathSegments = path?.split('.') || []
      const oldFieldName = pathSegments[pathSegments.length - 1]
      if (oldFieldName === newFieldName) {
        setEditMode(false)
        return
      }
      // @ts-ignore
      dispatch(renameField({ path, newFieldName }))
      const newPath = [
        ...(pathSegments.length > 0 ? pathSegments.slice(0, pathSegments.length - 1) : []),
        newFieldName,
      ].join('.')
      // @ts-ignore
      dispatch(selectElement(newPath))
    } else {
      setEditMode(true)
    }
  }, [dispatch, path, newFieldName, editMode, setEditMode])

  return (
    <>
      <Box>
        {!editMode ? (
          <>
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
              {pathSegments.map((segment, index) => (
                <Typography
                  key={segment + index}
                  color={pathSegments.length === index ? 'text.primary' : 'text.secondary'}
                >
                  {segment}
                </Typography>
              ))}
            </Breadcrumbs>
          </>
        ) : (
          <TextField
            variant="standard"
            label={'Key'}
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
          />
        )}
      </Box>
      <Grid container flex="auto">
        {/* <Grid item>
          <IconButton onClick={handleRenameOrSetEditMode}>{editMode ? <Save /> : <Edit />}</IconButton>
        </Grid> */}
        <Grid item>
          {/* <IconButton onClick={() => handleRemove()}>
            <Delete />
          </IconButton> */}
        </Grid>
      </Grid>
    </>
  )
}

const jsonSchema2RenderTreeView: (key: string, jsonSchema: JsonSchema7) => RenderTree = (key, jsonSchema) => {
  return {
    id: key,
    name: key,
    children: Object.keys(jsonSchema.properties || {}).map((key) =>
      jsonSchema2RenderTreeView(key, jsonSchema.properties[key] as JsonSchema7)
    ),
  }
}

export default function RightDrawer() {
  const selectedKey = useSelector(selectSelectedElementKey)
  const uiSchema = useSelector(selectUIElementFromSelection)
  const jsonSchema = useSelector(selectJsonSchema)
  const jsonSchemaTree = useMemo<RenderTree>(
    () => jsonSchema2RenderTreeView('Schema', jsonSchema as JsonSchema7),
    [jsonSchema]
  )
  const dispatch = useAppDispatch()
  // const handleLabelChange = useCallback(
  //   (e) => {
  //     const path = selectedKey?.split('.') || []
  //     // @ts-ignore
  //     dispatch(
  //       updateUISchemaByScope({
  //         scope: pathSegmentsToScope(path),
  //         uiSchema: {
  //           ...uiSchema,
  //           label: e.target.value,
  //         },
  //       })
  //     )
  //   },
  //   [dispatch, selectedKey, uiSchema]
  // )
  return (
    <Drawer
      open={!!selectedKey}
      variant={'persistent'}
      anchor={'right'}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 1 }}>
        {selectedKey?.startsWith('layout') ? (
          <Typography variant={'h6'}>Layout</Typography>
        ) : (
          <FieldNameEditor path={selectedKey} />
        )}
        {/* <TextField label={'Label'} onChange={handleLabelChange} value={uiSchema?.label || ''} /> */}
        <ToolSettings></ToolSettings>
      </Box>
      <Divider />
      <Box sx={{ overflow: 'auto', p: 0 }}>
        <RecursiveTreeView key={jsonSchemaTree.id} data={jsonSchemaTree} checkboxes={false} omitString={'Schema.'} />
      </Box>
    </Drawer>
  )
}
