import SelectToolSettings from './settings/SelectToolSettings'
import MultiSelectToolSettings from './settings/MultiSelectToolSettings'
import { ToolSetting } from './ToolSettingType'
import ListToolSettings from './settings/ListToolSettings'
import GroupToolSettings from './settings/GroupToolSettings'
import AlertToolSetting from './settings/AlertToolSettings'
import TextfieldToolSettings from './settings/TextfieldToolSettings'

export const ToolSettingsDefinitions: ToolSetting[] = [
  SelectToolSettings,
  MultiSelectToolSettings,
  ListToolSettings,
  GroupToolSettings,
  AlertToolSetting,
  TextfieldToolSettings,
]
