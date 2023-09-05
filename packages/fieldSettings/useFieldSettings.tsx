import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { maxBy } from 'lodash'
import {
  selectSelectedElementJsonSchema,
  selectSelectedPath,
  selectUIElementFromSelection,
  updateJsonSchemaByPath,
  useAppDispatch,
  useAppSelector,
  selectJsonSchema,
  selectSelectionDisplayName,
} from '@formswizard/state'
import { ToolSettingsDefinitions } from './ToolSettingsDefinition'
import { JsonSchema, UISchemaElement } from '@jsonforms/core'
import { ToolSetting } from '@formswizard/types'
import { filterNullOrUndef } from '@formswizard/utils'

export type ToolSettingsDefinition = {
  setToolDataBuffer: (value: ((prevState: any) => any) | any) => void

  toolSettingsJsonSchema: JsonSchema | null
  selectedElementJsonSchema: JsonSchema | null
  handleChange: (event) => void
  tooldataBuffer: any
  uiSchema: UISchemaElement
  selectedPath?: string | null | undefined
  selectionDisplayName: string | null | undefined
}

type ToolSettingsDefinitionProps = {
  additionalToolSettings?: ToolSetting[]
}

export function useToolSettings({
  additionalToolSettings = [],
}: ToolSettingsDefinitionProps = {}): ToolSettingsDefinition {
  const dispatch = useAppDispatch()
  const [tooldataBuffer, setToolDataBuffer] = useState({})

  const selectedPath = useAppSelector(selectSelectedPath)
  const jsonSchema = useAppSelector(selectJsonSchema)
  const UIElementFromSelection = useAppSelector(selectUIElementFromSelection)
  const selectedElementJsonSchema = useAppSelector(selectSelectedElementJsonSchema)
  const selectionDisplayName = useAppSelector(selectSelectionDisplayName)
  const prevSelectedPath = useRef(null)
  const context = useMemo(
    () => ({
      rootSchema: jsonSchema,
      config: {},
    }),
    [jsonSchema]
  )
  const toolSettings = useMemo(() => {
    if (!UIElementFromSelection) return null
    const tool = maxBy([...ToolSettingsDefinitions, ...additionalToolSettings], (d) => {
      const num = d.tester && d.tester(UIElementFromSelection, selectedElementJsonSchema, context)
      return num || null
    })
    return tool && tool.tester && tool.tester(UIElementFromSelection, selectedElementJsonSchema, context) > 0
      ? tool
      : null
  }, [selectedElementJsonSchema, UIElementFromSelection, context])
  console.log(selectionDisplayName)
  const toolSettingsJsonSchema = useMemo(
    () =>
      toolSettings
        ? {
            ...toolSettings.jsonSchema,
            properties: {
              ...toolSettings.toolSettingsMixins.reduce((prev, curr) => ({ ...prev, ...curr.jsonSchemaElement }), {}),
              ...toolSettings.jsonSchema.properties,
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
      if (!toolSettings || !UIElementFromSelection || !selectedPath) return
      const updatedJsonSchema = toolSettings.mapToolDataToWizardSchema(data, selectedElementJsonSchema ?? {})
      const updatedUIschema = toolSettings.mapToolDataToWizardUischema(data, UIElementFromSelection)

      const ToolsettingAddonsSchemaMapper = filterNullOrUndef(
            toolSettings.toolSettingsMixins
            .map((t) => t.mapAddonDataToWizardSchema))
      const ToolsettingAddonsUISchemaMapper = filterNullOrUndef(
            toolSettings.toolSettingsMixins
            .map((t) => t.mapAddonDataToWizardUISchema))
        const updatedJsonSchemaFromAddons = ToolsettingAddonsSchemaMapper.reduce(
            (prev, curr) =>  curr(data, prev),
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
    if (prevSelectedPath.current === selectedPath) return
    setToolDataBuffer(getToolData())
    //@ts-ignore
    prevSelectedPath.current = selectedPath
  }, [getToolData, selectedPath, tooldataBuffer])

  return {
    handleChange,
    uiSchema: { type: 'Control' },
    toolSettingsJsonSchema,
    tooldataBuffer,
    setToolDataBuffer,
    selectionDisplayName,
    selectedPath,
    selectedElementJsonSchema,
  }
}
