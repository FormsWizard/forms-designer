import i18next, { type i18n, type Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'

declare const __DEV__: boolean | undefined

const isDev: boolean = (() => {
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== undefined) {
    // @ts-ignore
    return process.env.NODE_ENV !== 'production'
  }
  // Vite injects import.meta.env at build time; cast to any to avoid TS errors
  // when the tsconfig target doesn't include `ImportMeta.env`
  const meta = (typeof import.meta !== 'undefined' ? import.meta : {}) as any
  // @ts-ignore
  return meta.env?.DEV ?? meta.env?.MODE !== 'production' ?? true
})()

export const FORMSDESIGNER_NS = 'formsdesigner'
export const DEFAULT_LANGUAGE = 'en'

const pendingResources: Array<{ namespace: string; language: string; resources: Record<string, string> }> = []

export const i18nInstance: i18n = i18next.createInstance()

let initialized = false

/**
 * Translations that live in the `formsdesigner` namespace and apply to every
 * JsonForms instance in the designer — both tool-settings panels and the live
 * form preview.
 *
 * Two categories:
 *  - Shared mixin labels (label, isPrimaryFieldFor) contributed by ToolSettingParts
 *  - Generic JsonForms error messages (error.*) that are valid form-wide
 */
const FORMSDESIGNER_BASE_TRANSLATIONS: Resource = {
  en: {
    [FORMSDESIGNER_NS]: {
      // --- Mixin: TitlePart ---
      'label.label': 'Label',
      // --- Mixin: PrimaryFieldPart ---
      'isPrimaryFieldFor.label': 'Primary field for',
      'isPrimaryFieldFor.none': 'None',
      'isPrimaryFieldFor.title': 'Title',
      'isPrimaryFieldFor.description': 'Description',
      'isPrimaryFieldFor.image': 'Image',
      // --- Shared error messages (apply to every JsonForms instance) ---
      'error.required': 'This field is required',
      'error.minLength': 'Must be at least {{limit}} characters',
      'error.maxLength': 'Must be at most {{limit}} characters',
      'error.minimum': 'Must be at least {{limit}}',
      'error.maximum': 'Must be at most {{limit}}',
      'error.pattern': 'Does not match the expected format',
      // --- AppBar ---
      'appBar.edit': 'Edit',
      'appBar.preview': 'Preview',
      'appBar.newForm': 'New form',
      'appBar.newFormTooltip': 'New form (reset and clear saved state)',
      'appBar.resetConfirm': 'Start a new form? Current form will be cleared and not restored on reload.',
      'appBar.exportSchema': 'Export schema',
      'appBar.exportSchemaTooltip': 'Export schema',
      'appBar.toolbox': 'Toolbox',
      'appBar.settings': 'Settings',
      'appBar.menu': 'Menu',
      'appBar.language': 'Language',
      'appBar.interfaceMode': 'Interface Mode',
      'appBar.darkMode': 'Dark Mode',
      // --- CodeBox ---
      'codeBox.copied': 'Copied!',
      'codeBox.copyToClipboard': 'Copy to clipboard',
      'codeBox.downloadAs': 'Download as {{filename}}',
      // --- Export Modal ---
      'exportModal.title': 'Export Schema',
      'exportModal.exportAll': 'Export All',
      'exportModal.jsonSchemaLabel': 'JSON Schema (with definitions)',
      'exportModal.uiSchemaLabel': 'UI Schema',
      'exportModal.additionalUiSchemata': 'Additional UI Schemata ({{count}})',
      'exportModal.close': 'Close',
    },
  },
  de: {
    [FORMSDESIGNER_NS]: {
      // --- Mixin: TitlePart ---
      'label.label': 'Beschriftung',
      // --- Mixin: PrimaryFieldPart ---
      'isPrimaryFieldFor.label': 'Primärfeld für',
      'isPrimaryFieldFor.title': 'Titel',
      'isPrimaryFieldFor.none': 'Keines',
      'isPrimaryFieldFor.description': 'Beschreibung',
      'isPrimaryFieldFor.image': 'Bild',
      // --- Shared error messages ---
      'error.required': 'Dieses Feld ist erforderlich',
      'error.minLength': 'Muss mindestens {{limit}} Zeichen lang sein',
      'error.maxLength': 'Darf höchstens {{limit}} Zeichen lang sein',
      'error.minimum': 'Muss mindestens {{limit}} betragen',
      'error.maximum': 'Darf höchstens {{limit}} betragen',
      'error.pattern': 'Entspricht nicht dem erwarteten Format',
      // --- AppBar ---
      'appBar.edit': 'Bearbeiten',
      'appBar.preview': 'Vorschau',
      'appBar.newForm': 'Neues Formular',
      'appBar.newFormTooltip': 'Neues Formular (zurücksetzen und gespeicherten Zustand löschen)',
      'appBar.resetConfirm': 'Neues Formular starten? Das aktuelle Formular wird gelöscht und beim Neuladen nicht wiederhergestellt.',
      'appBar.exportSchema': 'Schema exportieren',
      'appBar.exportSchemaTooltip': 'Schema exportieren',
      'appBar.toolbox': 'Werkzeugkasten',
      'appBar.settings': 'Einstellungen',
      'appBar.menu': 'Menü',
      'appBar.language': 'Sprache',
      'appBar.interfaceMode': 'Interaktionsmodus',
      'appBar.darkMode': 'Dunkelmodus',
      // --- CodeBox ---
      'codeBox.copied': 'Kopiert!',
      'codeBox.copyToClipboard': 'In die Zwischenablage kopieren',
      'codeBox.downloadAs': 'Herunterladen als {{filename}}',
      // --- Export Modal ---
      'exportModal.title': 'Schema exportieren',
      'exportModal.exportAll': 'Alles exportieren',
      'exportModal.jsonSchemaLabel': 'JSON-Schema (mit Definitionen)',
      'exportModal.uiSchemaLabel': 'UI-Schema',
      'exportModal.additionalUiSchemata': 'Weitere UI-Schemata ({{count}})',
      'exportModal.close': 'Schließen',
    },
  },
}

export function initI18n(additionalResources?: Resource): Promise<unknown> {
  if (initialized) return Promise.resolve()
  initialized = true

  const baseResources: Resource = {
    en: {
      [FORMSDESIGNER_NS]: {
        ...FORMSDESIGNER_BASE_TRANSLATIONS.en![FORMSDESIGNER_NS] as object,
      },
    },
    de: {
      [FORMSDESIGNER_NS]: {
        ...FORMSDESIGNER_BASE_TRANSLATIONS.de![FORMSDESIGNER_NS] as object,
      },
    },
    ...additionalResources,
  }

  // Merge any translations registered before init was called
  for (const { namespace, language, resources } of pendingResources) {
    if (!baseResources[language]) baseResources[language] = {}
    baseResources[language][namespace] = {
      ...(baseResources[language][namespace] as Record<string, string> ?? {}),
      ...resources,
    }
  }

  return i18nInstance
    .use(initReactI18next)
    .init({
      resources: baseResources,
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      defaultNS: FORMSDESIGNER_NS,
      ns: [FORMSDESIGNER_NS],
      supportedLngs: ['en', 'de'],
      interpolation: {
        escapeValue: false,
      },
      saveMissing: isDev,
      missingKeyHandler: isDev
        ? (lngs, ns, key) => {
            console.warn(`[i18n] Missing translation key "${key}" in namespace "${ns}" for language(s): ${lngs.join(', ')}`)
          }
        : undefined,
    })
}

/**
 * Register translations for a specific namespace and language.
 * Can be called before or after `initI18n` — resources registered before init
 * are collected and applied during initialization.
 */
export function addTranslations(
  namespace: string,
  language: string,
  resources: Record<string, string>,
): void {
  if (!initialized) {
    pendingResources.push({ namespace, language, resources })
    return
  }

  i18nInstance.addResourceBundle(language, namespace, resources, true, true)
}
