import { describe, expect, it } from 'vitest'
import { LOCALES } from '@shared/types'

type Messages = Record<string, string>

const locales = import.meta.glob<Messages>('../shared/locales/admin/*.json', { eager: true, import: 'default' })
const sources = import.meta.glob<string>(['./**/*.vue', './**/*.ts', '!./**/*.spec.ts', '!./test/**', '!./**/*.d.ts'], {
  eager: true,
  query: '?raw',
  import: 'default',
})

// every upper-case literal in the sources is an i18n key (`t('NAME')`, `title="COLLECTIONS"`, `header: 'NAME'`, ...)
const usedKeys = new Set(
  Object.values(sources).flatMap((source) =>
    [...source.matchAll(/['"]([A-Z][A-Z0-9_]+)['"]/g)].map((match) => match[1]!),
  ),
)

describe('admin i18n keys', () => {
  it('finds the keys used by the sources', () => {
    expect(usedKeys.size).toBeGreaterThan(40)
    expect(usedKeys).toContain('COLLECTIONS')
  })

  it.each(LOCALES)('every key used by the admin exists in %s', (locale) => {
    const messages = locales[`../shared/locales/admin/${locale}.json`] as Messages
    const missing = [...usedKeys].filter((key) => !(key in messages))
    expect(missing).toEqual([])
  })

  it.each(LOCALES)('no admin text is left empty in %s', (locale) => {
    const messages = locales[`../shared/locales/admin/${locale}.json`] as Messages
    expect(Object.entries(messages).filter(([, value]) => value.trim() === '')).toEqual([])
  })
})
