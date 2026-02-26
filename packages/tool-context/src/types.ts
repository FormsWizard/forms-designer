import { ToolContextState, FormsDesignerToolCollection, JsonSchema } from '@formswizard/types'

export interface ToolContextValue<T extends JsonSchema = JsonSchema> extends ToolContextState<T> {
  isProviderPresent: boolean
}

export interface ToolProviderProps<T extends JsonSchema = JsonSchema> {
  children: React.ReactNode
  toolCollections: FormsDesignerToolCollection<T>[]
}
