import type {
  Labelable,
  Scopable,
  UISchemaElement,
  JsonFormsRendererRegistryEntry,
  JsonSchema4,
  JsonSchema7,
  JsonFormsCellRendererRegistryEntry,
  Layout,
} from '@jsonforms/core'
import type { JSONSchema4, JSONSchema7 } from 'json-schema'
import type { ComponentType } from 'react';
import type { SxProps, Theme } from '@mui/material';
import type { Format } from 'ajv';

export type JsonSchema = JSONSchema7 | JSONSchema4| JsonSchema4 | JsonSchema7;

export type JsonSchemaDefinition = JsonSchema | boolean

export const isJsonSchema = (
  schema: JsonSchemaDefinition | null | undefined
): schema is JsonSchema => {
  return schema !== null && schema !== undefined && typeof schema === 'object'
}

export type ScopableUISchemaElement = UISchemaElement & Scopable & Labelable

export const isScopableUISchemaElement = (element: any): element is ScopableUISchemaElement => element.scope

export type ToolIconComponent = ComponentType<{
  alt?: string
  theme?: Theme
  sx?: SxProps<Theme>
}>

export type ToolIconRegistry = Record<string, ToolIconComponent>

export type DraggableMeta = {
  name: string
  ToolIconName?: string
  componentType?: 'tool' | 'block'
}

export type DraggableComponent = DraggableMeta & {
  jsonSchemaElement: JsonSchema
  uiSchema?: UISchemaElement
}

export type DraggableUISchemaElement = DraggableMeta & {
  uiSchema: UISchemaElement
}

export type DraggableElement = DraggableComponent | DraggableUISchemaElement

export type JsonFormsEditState = {
  jsonSchema: JsonSchema
  uiSchema?: any
  selectedElementKey?: string | null
  editMode: boolean
}

export type TesterContext<T extends JsonSchema = JsonSchema> = {
    rootSchema: T;
    config: any;
}
export type RankedTester<T extends JsonSchema = JsonSchema> = (uischema: UISchemaElement, schema: T, context: TesterContext) => number;

export type ToolSettingsMixin<T extends JsonSchema = JsonSchema> = {
  mapWizardToAddonData: (previousData, wizardSchema: T | null, uiSchema: any) => any
  mapAddonDataToWizardSchema?: (toolData: any, wizardSchema: T, rootSchema: T) => T
  mapAddonDataToWizardUISchema: (toolData: any, uiSchema: any, rootSchema: T) => any
  jsonSchemaElement: T extends object ? (T & { properties?: unknown })['properties'] : never
}

export type ToolSettingsJsonSchema<T extends JsonSchema = JsonSchema> = T | ((rootSchema: T) => T)

export type ToolSetting<T extends JsonSchema = JsonSchema> = {
  mapWizardSchemaToToolData: (wizardSchema: T | null, uiSchema: any) => any
  mapToolDataToWizardSchema: (toolData: any, wizardSchema: T, rootSchema: T) => T
  mapToolDataToWizardUischema: (toolData: any, wizardUiSchema: any, rootSchema: T) => any
  tester: RankedTester<T>
  jsonSchema: ToolSettingsJsonSchema<T>
  toolSettingsMixins: ToolSettingsMixin<T>[]
}

export type ToolSettingFunction<T extends JsonSchema = JsonSchema> = (jsonSchema: T) => ToolSetting<T>
export type ToolSettings<T extends JsonSchema = JsonSchema> = ToolSetting<T>[]

export type PluggableToolDefinition<T extends JsonSchema = JsonSchema> = {
  rendererRegistry: JsonFormsRendererRegistryEntry[]
  dropRendererRegistry: JsonFormsRendererRegistryEntry[]
  toolSettings: ToolSettings<T>
  toolBoxElements: DraggableElement[]
}

export type AjvFormatRegistry = Record<string, Format>

export type ToolCollectionInfo = {
  name: string
  description: string
  categories: string[]
}

export type TranslationDictionary = Record<string, string>

export type LanguageTranslations = Record<string, TranslationDictionary>

export type CollectionTranslations = {
  namespace: string
  resources: LanguageTranslations
}

export type ToolContextState<T extends JsonSchema = JsonSchema> = {
  iconRegistry: ToolIconRegistry
  rendererRegistry: JsonFormsRendererRegistryEntry[]
  cellRendererRegistry: JsonFormsCellRendererRegistryEntry[]
  ajvFormatRegistry: AjvFormatRegistry
  toolSettings: ToolSettings<T>
  draggableElements: DraggableElement[]
  registeredCollections: string[]
  translations: CollectionTranslations[]
}

export type FormsDesignerToolCollection<T extends JsonSchema = JsonSchema> = {
  info: ToolCollectionInfo
  /**
   * Optional translations for this collection, keyed by language then by
   * JsonForms i18n key (e.g. `{ en: { 'multiline.label': 'Multiline' } }`).
   * The namespace is derived from `info.name`.
   */
  translations?: LanguageTranslations
} & Partial<Omit<ToolContextState<T>, 'registeredCollections' | 'translations'>>

export type UISchemaElementWithPath = UISchemaElement & { path: string; structurePath?: string }
export type LayoutWithPath = Layout & { path: string }


export const isUISchemaElementWithPath = (element: UISchemaElement): element is UISchemaElementWithPath => {
  return 'path' in element
}

export const isLayoutWithPath = (element: Layout): element is LayoutWithPath => {
  return 'path' in element
}