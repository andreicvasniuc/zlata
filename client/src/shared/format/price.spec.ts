import { describe, expect, it } from 'vitest'
import { CURRENCIES, LOCALES } from '../types'
import { formatPrice } from './price'

// Intl separates groups with a non-breaking space in some locales
const plain = (text: string | null) => text?.replace(/\s/g, ' ')

describe('formatPrice', () => {
  it('formats a whole-number price per locale', () => {
    expect(plain(formatPrice(1200, 'EUR', 'en'))).toBe('€1,200')
    expect(plain(formatPrice(1200, 'EUR', 'ua'))).toBe('1 200 €')
    expect(plain(formatPrice(1200, 'EUR', 'ru'))).toBe('1 200 €')
    expect(plain(formatPrice(1200, 'EUR', 'ro'))).toBe('1.200 €')
  })

  it('formats every currency in every locale without decimals', () => {
    for (const locale of LOCALES) {
      for (const currency of CURRENCIES) {
        const text = formatPrice(950, currency, locale)
        expect(text, `${locale} ${currency}`).toMatch(/950/)
        expect(text, `${locale} ${currency}`).not.toMatch(/[.,]\d\d(?!\d)/)
      }
    }
  })

  it('returns null without an amount or a currency', () => {
    expect(formatPrice(null, 'EUR', 'en')).toBeNull()
    expect(formatPrice(undefined, 'EUR', 'en')).toBeNull()
    expect(formatPrice(0, 'EUR', 'en')).toBeNull()
    expect(formatPrice(1200, null, 'en')).toBeNull()
    expect(formatPrice(1200, undefined, 'en')).toBeNull()
  })
})
