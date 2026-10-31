import { LOCALES, type Locale } from '../types'

export const DEFAULT_LOCALE: Locale = 'ua'
export const FALLBACK_LOCALE: Locale = 'en'

const STORAGE_KEY = 'zlata.locale'
// angular-translate's cookie storage key: keeps the language chosen by visitors of the old site.
const LEGACY_COOKIE = 'NG_TRANSLATE_LANG_KEY'

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale)

function readLegacyCookie(): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${LEGACY_COOKIE}=([^;]*)`))
  return match?.[1] ? decodeURIComponent(match[1]) : undefined
}

export function getSavedLocale(): Locale | undefined {
  const saved = localStorage.getItem(STORAGE_KEY) ?? readLegacyCookie()
  return isLocale(saved) ? saved : undefined
}

export const saveLocale = (locale: Locale): void => localStorage.setItem(STORAGE_KEY, locale)

// The URL locale wins, then the saved preference, then the default.
export function resolveLocale(urlLocale?: string): Locale {
  if (isLocale(urlLocale)) return urlLocale
  return getSavedLocale() ?? DEFAULT_LOCALE
}
