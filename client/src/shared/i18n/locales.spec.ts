import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import { LOCALES } from '../types'

type Messages = Record<string, string>

const files = {
  app: import.meta.glob<Messages>('../locales/app/*.json', { eager: true, import: 'default' }),
  admin: import.meta.glob<Messages>('../locales/admin/*.json', { eager: true, import: 'default' }),
}

describe.each(['app', 'admin'] as const)('%s locales', (namespace) => {
  const messages = Object.fromEntries(
    LOCALES.map((locale) => [locale, files[namespace][`../locales/${namespace}/${locale}.json`] as Messages]),
  )
  const i18n = createI18n({ legacy: false, locale: 'en', messages, missingWarn: false, fallbackWarn: false })

  it('has a file for every locale', () => {
    for (const locale of LOCALES) expect(messages[locale]).toBeDefined()
  })

  it.each(LOCALES)('renders every key in %s without AngularJS interpolation left over', (locale) => {
    for (const [key, value] of Object.entries(messages[locale] ?? {})) {
      const rendered = i18n.global.t(key, {}, { locale })
      expect(value, `${locale}:${key}`).not.toContain('{{')
      expect(rendered, `${locale}:${key}`).toBe(value)
    }
  })

  it('has the same keys in every locale as in English', () => {
    const english = Object.keys(messages.en ?? {}).sort()
    for (const locale of LOCALES) expect(Object.keys(messages[locale] ?? {}).sort(), locale).toEqual(english)
  })
})
