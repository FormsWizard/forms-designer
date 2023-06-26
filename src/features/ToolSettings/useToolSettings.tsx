import { isEqual } from 'lodash'
import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../app/hooks/reduxHooks'
import { selectSelectedElementKey, selectUIElementFromSelection, updateJsonSchemaByPath } from '../wizard/WizardSlice'
import SelectToolSettings from './settings/SelectToolSettings'
import { ToolSettingsDefinitions } from './ToolSettingsDefinition'
import { selectSelectedElementJsonSchema } from './ToolSettingsSelectors'

function useToolSettings() {
  const dispatch = useAppDispatch()
  const [tooldataBuffer, setToolDataBuffer] = useState({})
  const selectedKey = useSelector(selectSelectedElementKey)
  const UIElementFromSelection = useSelector(selectUIElementFromSelection)
  const selectedElementJsonSchema = useSelector(selectSelectedElementJsonSchema)
  const prevSelectedKey = useRef(null)
  console.log({ selectedElementJsonSchema, UIElementFromSelection })
  const toolSettings = useMemo(
    () =>
      selectedElementJsonSchema
        ? ToolSettingsDefinitions.find((d) => d.isTool(selectedElementJsonSchema, UIElementFromSelection)) ?? null
        : null,
    [selectedElementJsonSchema, UIElementFromSelection]
  )
  const toolSettingsJsonSchema = useMemo(
    () =>
      toolSettings
        ? {
            ...toolSettings.JsonSchema,
            properties: {
              ...toolSettings.JsonSchema.properties,
              ...toolSettings.toolSettingsMixins.reduce(
                (prev, curr) => ({ ...prev, ...curr.jsonSchema.properties }),
                {}
              ),
            },
          }
        : null,
    [toolSettings]
  )
  const handleChange = (event) => {
    setToolDataBuffer(event.data)
    mapToolToWizard(event.data)
  }

  const getToolData = useCallback(
    () =>
      toolSettings
        ? toolSettings.toolSettingsMixins.reduce(
            (prev, curr) => curr.mapWizardToAddonData(prev, selectedElementJsonSchema, UIElementFromSelection),
            toolSettings.mapWizardSchemaToToolData(selectedElementJsonSchema, UIElementFromSelection)
          )
        : null,
    [selectedElementJsonSchema, toolSettings, UIElementFromSelection]
  )

  const mapToolToWizard = useCallback(
    (data) => {
      const updatedJsonSchema = toolSettings.mapToolDataToWizardSchema(data, selectedElementJsonSchema)
      const updatedUIschema = toolSettings.mapToolDataToWizardUischema(data, UIElementFromSelection)
      const ToolsettingAddonsSchemaMapper = toolSettings.toolSettingsMixins
        .map((t) => t.mapAddonDataToWizardSchema)
        .filter(Boolean)
      const ToolsettingAddonsUISchemaMapper = toolSettings.toolSettingsMixins
        .map((t) => t.mapAddonDataToWizardUISchema)
        .filter(Boolean)
      const updatedJsonSchemaFromAddons = ToolsettingAddonsSchemaMapper.reduce(
        (prev, curr) => curr(data, prev),
        updatedJsonSchema
      )
      const updatedUIschemaWithAddons = ToolsettingAddonsUISchemaMapper.reduce(
        (prev, curr) => curr(data, prev),
        updatedUIschema
      )

      dispatch(
        updateJsonSchemaByPath({
          path: selectedKey,
          updatedSchema: updatedJsonSchemaFromAddons,
          updatedUIschema: updatedUIschemaWithAddons,
        })
      )
    },
    [UIElementFromSelection, dispatch, selectedElementJsonSchema, selectedKey, toolSettings]
  )

  useEffect(() => {
    if (prevSelectedKey.current === selectedKey) return
    setToolDataBuffer(getToolData())
    prevSelectedKey.current = selectedKey
  }, [getToolData, selectedKey])

  return { handleChange, uiSchema: {}, toolSettingsJsonSchema, tooldataBuffer, setToolDataBuffer }
}

export default useToolSettings
