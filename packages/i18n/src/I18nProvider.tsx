import React, { type ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { i18nInstance, initI18n } from './i18nInstance'
import type { Resource } from 'i18next'

export type I18nProviderProps = {
  children: ReactNode
  /**
   * Additional i18next resources to merge on top of the built-in ones.
   * Useful when the host application wants to override or extend translations.
   */
  additionalResources?: Resource
}

/**
 * Initializes the shared i18next instance and makes it available to all
 * react-i18next hooks within the forms-designer component tree.
 *
 * Add this provider once, as high up in the tree as makes sense for your
 * host application (vite, Next.js, Storybook, CRA).  Each forms-wizard
 * package registers its own namespaced translations via `addTranslations`,
 * so you only need this single provider — no manual translation wiring in
 * the host app is required.
 */
export function I18nProvider({ children, additionalResources }: I18nProviderProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initI18n(additionalResources).then(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  )
}
