import { afterEach, describe, expect, it } from 'vitest'
import { DEFAULT_LOCALE, getSavedLocale, resolveLocale, saveLocale } from './locale'

const clearCookie = () => {
  document.cookie = 'NG_TRANSLATE_LANG_KEY=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
}

describe('resolveLocale', () => {
  afterEach(() => {
    localStorage.clear()
    clearCookie()
  })

  it('falls back to Ukrainian', () => {
    expect(DEFAULT_LOCALE).toBe('ua')
    expect(resolveLocale()).toBe('ua')
  })

  it('prefers the saved choice to the default', () => {
    saveLocale('ro')
    expect(resolveLocale()).toBe('ro')
  })

  it('prefers the locale of the URL to the saved choice', () => {
    saveLocale('ro')
    expect(resolveLocale('en')).toBe('en')
  })

  it('ignores an unknown locale in the URL', () => {
    saveLocale('ru')
    expect(resolveLocale('de')).toBe('ru')
  })

  it('still honours the language cookie of the old site', () => {
    document.cookie = 'NG_TRANSLATE_LANG_KEY=ru; path=/'
    expect(getSavedLocale()).toBe('ru')
    expect(resolveLocale()).toBe('ru')
  })

  it('ignores a saved value that is not a locale', () => {
    localStorage.setItem('zlata.locale', 'xx')
    expect(getSavedLocale()).toBeUndefined()
  })
})
