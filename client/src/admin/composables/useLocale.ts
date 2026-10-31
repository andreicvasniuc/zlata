import { inject, type InjectionKey } from 'vue'
import type { Locale } from '@shared/types'

export type SetLocale = (locale: Locale) => Promise<void>

export const setLocaleKey: InjectionKey<SetLocale> = Symbol('setLocale')

export function useSetLocale(): SetLocale {
  const setLocale = inject(setLocaleKey)
  if (!setLocale) throw new Error('setLocale is not provided')
  return setLocale
}
