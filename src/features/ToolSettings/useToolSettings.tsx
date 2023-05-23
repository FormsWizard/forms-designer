import { isEqual } from 'lodash'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../app/hooks/reduxHooks'
import { selectSelectedElementKey, selectUIElementFromSelection, updateJsonSchemaByPath } from '../wizard/WizardSlice'
import SelectToolSettings from './SelectToolSettings'
import { ToolSettingsDefinitions } from './ToolSettingsDefinition'

function useToolSettings(selectedElementJsonSchema) {
  const dispatch = useAppDispatch()
  const selectedKey = useSelector(selectSelectedElementKey)
  const UIElementFromSelection = useSelector(selectUIElementFromSelection)

  const toolSettings = useMemo(
    () =>
      selectedElementJsonSchema
        ? ToolSettingsDefinitions.find((d) => d.isTool(selectedElementJsonSchema)) ?? null
        : null,
    [selectedElementJsonSchema]
  )
  const handleChange = (event) => {
    if (isEqual(event.data, toolSettings.mapWizardSchemaToToolData(selectedElementJsonSchema, UIElementFromSelection)))
      return
    const updatedJsonSchema = toolSettings.mapToolDataToWizardSchema(event.data, selectedElementJsonSchema)
    const updatedUIschema = toolSettings.mapToolDataToWizardUischema(event.data, UIElementFromSelection)
    dispatch(updateJsonSchemaByPath({ path: selectedKey, updatedSchema: updatedJsonSchema, updatedUIschema }))
  }

  return { handleChange, uiSchema: {}, toolSettings }
}

export default useToolSettings
