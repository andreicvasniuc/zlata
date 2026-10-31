import { computed, inject, type InjectionKey } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { currentLocale } from '@shared/api'
import { isLocale } from '@shared/i18n/locale'
import type { Locale } from '@shared/types'

// main.ts provides the function that loads a locale's messages and makes it the current one.
export const setLocaleKey: InjectionKey<(locale: Locale) => Promise<void>> = Symbol('setLocale')

export function useSetLocale() {
  const setLocale = inject(setLocaleKey)
  if (!setLocale) throw new Error('setLocale is not provided')
  return setLocale
}

// The locale the visitor chose with a URL prefix, if any (`/ua/collections`).
export function useUrlLocale() {
  const route = useRoute()
  return computed(() => (isLocale(route.params.locale) ? route.params.locale : undefined))
}

// Internal links keep the locale prefix of the page they are on, so shared URLs keep their language.
export function useLocalePath() {
  const urlLocale = useUrlLocale()
  return (path: string): string => (urlLocale.value ? `/${urlLocale.value}${path === '/' ? '' : path}` : path)
}

const LOCALE_PREFIX = /^\/(en|ua|ru|ro)(?=\/|$)/

// Moves to the current page in another language (always with a prefix, so the URL says which language it is).
export function useSwitchLanguage() {
  const route = useRoute()
  const router = useRouter()
  const setLocale = useSetLocale()

  return async (locale: Locale) => {
    if (locale === currentLocale.value && route.params.locale === locale) return
    await setLocale(locale)
    const rest = route.path.replace(LOCALE_PREFIX, '')
    await router.replace({ path: `/${locale}${rest === '/' ? '' : rest}`, query: route.query, hash: route.hash })
  }
}
