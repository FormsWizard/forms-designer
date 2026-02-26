import type { LanguageTranslations } from '@formswizard/types'

/**
 * Translation dictionaries for the `basic-tools` namespace.
 *
 * Keys follow the JsonForms i18n convention:
 *   - `<propertyName>.label`  → rendered as the field label in the settings panel
 *   - `<propertyName>.<enumValue>` → enum option labels
 *
 * Mixin translations (label, isPrimaryFieldFor) live in the `formsdesigner`
 * namespace (seeded in @formswizard/i18n) and do NOT need to be repeated here.
 *
 * Toolbox display names (tools.*) — consumed by draggableComponents.ts via
 * `i18nInstance.t` at load time and by Toolbox.tsx reactively via `useJsonFormsI18n`.
 */
export const translations: LanguageTranslations = {
  en: {
    // --- TextfieldToolSettings ---
    'multiline.label': 'Multiline',

    // --- NumberInputToolSettings ---
    'min.label': 'Minimum value',
    'max.label': 'Maximum value',
    'floatingPoint.label': 'Floating point',

    // --- SelectToolSettings (single select / radio) ---
    'options.label': 'Options',
    'format.label': 'Show as dropdown',

    // --- MultiSelectToolSettings shares `options.label` above ---

    // --- ListToolSettings ---
    'columns.label': 'Columns',
    'showSortButtons.label': 'Show sort buttons',

    // --- AlertToolSettings ---
    'text.label': 'Alert text',

    // --- CheckToolSettings ---
    'defaultIsChecked.label': 'Checked by default',

    // --- Toolbox element display names ---
    'tools.label': 'Label',
    'tools.alert': 'Alert',
    'tools.textField': 'Text Field',
    'tools.number': 'Number',
    'tools.dateField': 'Date Field',
    'tools.dateTimeField': 'Date & Time Field',
    'tools.checkbox': 'Checkbox',
    'tools.multilineTextField': 'Multiline Text Field',
    'tools.radioButtons': 'Radio Buttons',
    'tools.multiselect': 'Multiselect',
    'tools.listOfObjects': 'List of Objects',
    'tools.horizontalLayout': 'Horizontal Layout',
    'tools.verticalLayout': 'Vertical Layout',
    'tools.group': 'Group',
  },
  de: {
    // --- TextfieldToolSettings ---
    'multiline.label': 'Mehrzeilig',

    // --- NumberInputToolSettings ---
    'min.label': 'Mindestwert',
    'max.label': 'Höchstwert',
    'floatingPoint.label': 'Gleitkommazahl',

    // --- SelectToolSettings ---
    'options.label': 'Optionen',
    'format.label': 'Als Dropdown anzeigen',

    // --- ListToolSettings ---
    'columns.label': 'Spalten',
    'showSortButtons.label': 'Sortierschaltflächen anzeigen',

    // --- AlertToolSettings ---
    'text.label': 'Hinweistext',

    // --- CheckToolSettings ---
    'defaultIsChecked.label': 'Standardmäßig aktiviert',

    // --- Toolbox element display names ---
    'tools.label': 'Beschriftung',
    'tools.alert': 'Hinweis',
    'tools.textField': 'Textfeld',
    'tools.number': 'Zahl',
    'tools.dateField': 'Datumsfeld',
    'tools.dateTimeField': 'Datums- und Zeitfeld',
    'tools.checkbox': 'Kontrollkästchen',
    'tools.multilineTextField': 'Mehrzeiliges Textfeld',
    'tools.radioButtons': 'Optionsschaltflächen',
    'tools.multiselect': 'Mehrfachauswahl',
    'tools.listOfObjects': 'Objektliste',
    'tools.horizontalLayout': 'Horizontales Layout',
    'tools.verticalLayout': 'Vertikales Layout',
    'tools.group': 'Gruppe',
  },
}
