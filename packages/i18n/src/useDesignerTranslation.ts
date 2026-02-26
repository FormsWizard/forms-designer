import { useEffect, useMemo, useState } from 'react'
import { i18nInstance, FORMSDESIGNER_NS } from './i18nInstance'

/**
 * Lightweight translation hook that binds directly to the custom i18nInstance.
 *
 * Unlike `useTranslation(ns, { i18n })` this avoids the react-i18next v15 / TS4
 * generic overload issues and works regardless of whether the component sits
 * inside an `<I18nextProvider>`.
 */
export function useDesignerTranslation() {
  const [lang, setLang] = useState(i18nInstance.language)

  useEffect(() => {
    const handler = (lng: string) => setLang(lng)
    i18nInstance.on('languageChanged', handler)
    return () => { i18nInstance.off('languageChanged', handler) }
  }, [])

  const t = useMemo(() => {
    const tRaw = i18nInstance.t.bind(i18nInstance) as (...a: any[]) => any
    return (key: string, options?: Record<string, any>): string =>
      String(tRaw(key, { ns: FORMSDESIGNER_NS, ...options }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  return { t }
}
