import SelectToolSettings from './settings/SelectToolSettings'
import MultiSelectToolSettings from './settings/MultiSelectToolSettings'
import ListToolSettings from './settings/ListToolSettings'
import GroupToolSettings from './settings/GroupToolSettings'
import AlertToolSetting from './settings/AlertToolSettings'
import TextfieldToolSettings from './settings/TextfieldToolSettings'
import CheckToolSettings from './settings/CheckToolSettings'
import NumberInputToolSettings from './settings/NumberInputToolSettings'
import { ToolSettings } from '@formswizard/types'

export const ToolSettingsDefinitions: ToolSettings = [
  SelectToolSettings,
  MultiSelectToolSettings,
  ListToolSettings,
  GroupToolSettings,
  AlertToolSetting,
  TextfieldToolSettings,
  CheckToolSettings,
  NumberInputToolSettings,
]
