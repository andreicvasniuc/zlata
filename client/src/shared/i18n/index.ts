import { createI18n } from 'vue-i18n'
import { currentLocale } from '../api'
import type { Locale } from '../types'
import { DEFAULT_LOCALE, FALLBACK_LOCALE, saveLocale } from './locale'

export type Messages = Record<string, string>
type Loader = () => Promise<{ default: Messages }>

// One chunk per locale; the fallback locale is always loaded next to the current one.
const loaders = {
  app: import.meta.glob<{ default: Messages }>('../locales/app/*.json'),
  admin: import.meta.glob<{ default: Messages }>('../locales/admin/*.json'),
}

export type Namespace = keyof typeof loaders

const loaderFor = (namespace: Namespace, locale: Locale): Loader => {
  const loader = loaders[namespace][`../locales/${namespace}/${locale}.json`]
  if (!loader) throw new Error(`Missing ${namespace} locale file: ${locale}`)
  return loader
}

export function createAppI18n(namespace: Namespace, locale: Locale = DEFAULT_LOCALE) {
  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: FALLBACK_LOCALE,
    messages: {},
    missingWarn: false,
    fallbackWarn: false,
  })

  const ensureLoaded = async (target: Locale) => {
    for (const code of new Set([FALLBACK_LOCALE, target])) {
      if (!i18n.global.availableLocales.includes(code)) {
        i18n.global.setLocaleMessage(code, (await loaderFor(namespace, code)()).default)
      }
    }
  }

  const setLocale = async (target: Locale) => {
    await ensureLoaded(target)
    i18n.global.locale.value = target
    currentLocale.value = target
    saveLocale(target)
    document.documentElement.lang = target
  }

  return { i18n, setLocale, ensureLoaded }
}
