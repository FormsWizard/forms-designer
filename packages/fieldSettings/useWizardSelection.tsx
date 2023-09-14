import {
  selectSelectedElementJsonSchema,
  selectSelectedPath,
  selectUIElementFromSelection,
  useAppSelector,
  selectSelectionDisplayName,
  selectSelectedKeyName,
} from '@formswizard/state'
import { ToolSettingsDefinitions } from './ToolSettingsDefinition'
import { JsonSchema, UISchemaElement } from '@jsonforms/core'
import { ToolSetting } from './ToolSettingType'

export type WizardSelection = {
  selectedPath: string | null | undefined
  selectedKeyName: string | null | undefined
  UIElementFromSelection: UISchemaElement | null | undefined
  selectedElementJsonSchema: JsonSchema | null | undefined
  selectionDisplayName: string | null | undefined
}

export function useWizardSelection(): WizardSelection {
  const selectedPath = useAppSelector(selectSelectedPath)
  const selectedKeyName = useAppSelector(selectSelectedKeyName)
  const UIElementFromSelection = useAppSelector(selectUIElementFromSelection)
  const selectedElementJsonSchema = useAppSelector(selectSelectedElementJsonSchema)
  const selectionDisplayName = useAppSelector(selectSelectionDisplayName)

  return {
    selectedPath,
    selectedKeyName,
    UIElementFromSelection,
    selectedElementJsonSchema,
    selectionDisplayName,
  }
}
