import { isEqual } from 'lodash'
import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../app/hooks/reduxHooks'
import { selectSelectedElementKey, selectUIElementFromSelection, updateJsonSchemaByPath } from '../wizard/WizardSlice'
import SelectToolSettings from './SelectToolSettings'
import { ToolSettingsDefinitions } from './ToolSettingsDefinition'
import { selectSelectedElementJsonSchema } from './ToolSettingsSelectors'

function useToolSettings() {
  const dispatch = useAppDispatch()
  const [tooldataBuffer, setToolDataBuffer] = useState({})
  const selectedKey = useSelector(selectSelectedElementKey)
  const UIElementFromSelection = useSelector(selectUIElementFromSelection)
  const selectedElementJsonSchema = useSelector(selectSelectedElementJsonSchema)
  const prevSelectedKey = useRef(null)

  const toolSettings = useMemo(
    () =>
      selectedElementJsonSchema
        ? ToolSettingsDefinitions.find((d) => d.isTool(selectedElementJsonSchema)) ?? null
        : null,
    [selectedElementJsonSchema]
  )
  const handleChange = (event) => {
    setToolDataBuffer(event.data)
    mapToolToWizard(event.data)
  }

  const getToolData = useCallback(
    () => toolSettings?.mapWizardSchemaToToolData(selectedElementJsonSchema, UIElementFromSelection),
    [selectedElementJsonSchema, toolSettings, UIElementFromSelection]
  )

  const mapToolToWizard = useCallback(
    (data) => {
      const updatedJsonSchema = toolSettings.mapToolDataToWizardSchema(data, selectedElementJsonSchema)
      const updatedUIschema = toolSettings.mapToolDataToWizardUischema(data, UIElementFromSelection)
      dispatch(updateJsonSchemaByPath({ path: selectedKey, updatedSchema: updatedJsonSchema, updatedUIschema }))
    },
    [UIElementFromSelection, dispatch, selectedElementJsonSchema, selectedKey, toolSettings]
  )

  useEffect(() => {
    if (prevSelectedKey.current === selectedKey) return
    setToolDataBuffer(getToolData())
    prevSelectedKey.current = selectedKey
  }, [getToolData, selectedKey])

  return { handleChange, uiSchema: {}, toolSettings, tooldataBuffer, setToolDataBuffer }
}

export default useToolSettings
