import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'

import {
  selectSelectedElementKey,
  selectUIElementFromSelection,
  updateJsonSchemaByPath,
  selectSelectedElementJsonSchema,
  selectSelectedPath,
  useAppDispatch,
  useAppSelector,
} from '@formswizard/state'
import { ToolSettingsDefinitions } from './ToolSettingsDefinition'
import {JsonSchema7, UISchemaElement} from "@jsonforms/core";

export type ToolSettingsDefinition ={
  setToolDataBuffer:
      (value: (((prevState: any) => any) | any)) => void;
  selectedKey?: string | null;
  toolSettingsJsonSchema: JsonSchema7 | null;
  handleChange: (event) => void;
  tooldataBuffer: any;
  uiSchema: UISchemaElement,
}
export function useToolSettings(): ToolSettingsDefinition {
  const dispatch = useAppDispatch()
  const [tooldataBuffer, setToolDataBuffer] = useState({})
  const selectedKey = useAppSelector(selectSelectedElementKey)
  const selectedPath = useAppSelector(selectSelectedPath)
  const UIElementFromSelection = useAppSelector(selectUIElementFromSelection)
  const selectedElementJsonSchema = useAppSelector(selectSelectedElementJsonSchema)
  const prevSelectedKey = useRef(null)

  const toolSettings = useMemo(
    () =>
      UIElementFromSelection
        ? ToolSettingsDefinitions.find((d) => {
            let tool = d.isTool(selectedElementJsonSchema, UIElementFromSelection)
            return tool
          }) ?? null
        : null,
    [selectedElementJsonSchema, UIElementFromSelection]
  )

  const toolSettingsJsonSchema = useMemo(
    () =>
      toolSettings
        ? {
            ...toolSettings.JsonSchema,
            properties: {
              ...toolSettings.toolSettingsMixins.reduce((prev, curr) => ({ ...prev, ...curr.jsonSchemaElement }), {}),
              ...toolSettings.JsonSchema.properties,
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
            toolSettings.mapWizardSchemaToToolData(selectedElementJsonSchema ?? {}, UIElementFromSelection)
          )
        : null,
    [selectedElementJsonSchema, toolSettings, UIElementFromSelection]
  )

  const mapToolToWizard = useCallback(
    (data) => {
      if (!toolSettings || !UIElementFromSelection || !selectedPath) return
      const updatedJsonSchema = toolSettings.mapToolDataToWizardSchema(data, selectedElementJsonSchema ?? {})
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
          path: selectedPath,
          updatedSchema: updatedJsonSchemaFromAddons,
          updatedUIschema: updatedUIschemaWithAddons,
        })
      )
    },
    [UIElementFromSelection, dispatch, selectedElementJsonSchema, selectedPath, toolSettings]
  )

  useEffect(() => {
    if (prevSelectedKey.current === selectedPath) return
    setToolDataBuffer(getToolData())
    //@ts-ignore
    prevSelectedKey.current = selectedPath
  }, [getToolData, selectedPath])

  return { handleChange, uiSchema: { type: 'Control'}, toolSettingsJsonSchema, tooldataBuffer, setToolDataBuffer, selectedKey }
}

