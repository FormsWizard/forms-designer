import type { LanguageTranslations } from '@formswizard/types'

/**
 * Translation dictionaries for the `advanced-tools` namespace.
 *
 * The tool settings for advanced tools are delegated from
 * `@formswizard/experimental-renderers` (location tools). Keys here should
 * mirror the JSON schema property names used in those settings schemas.
 *
 * Add keys once the experimental-renderers settings schemas are fully audited.
 */
export const translations: LanguageTranslations = {
  en: {
    // --- Toolbox element display names (for future toolbox i18n) ---
    'tools.person': 'Person',
    'tools.address': 'Address',
    'tools.Location': 'Location',
  },
  de: {
    // --- Toolbox element display names ---
    'tools.person': 'Person',
    'tools.address': 'Adresse',
    'tools.Location': 'Standort',
  },
}
