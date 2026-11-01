import { describe, expect, it } from 'vitest'
import { contactHref, isRetiredChannel } from './contactLink'

describe('contactHref', () => {
  it('links e-mail addresses, by icon class or by shape', () => {
    expect(contactHref('ti-email', 'zlata@example.com')).toBe('mailto:zlata@example.com')
    expect(contactHref(undefined, ' zlata@example.com ')).toBe('mailto:zlata@example.com')
    expect(contactHref('ti-email', 'not an address')).toBeUndefined()
  })

  it('links phone numbers, keeping a leading plus', () => {
    expect(contactHref('ti-mobile', '+380 (50) 123-45-67')).toBe('tel:+380501234567')
    expect(contactHref('ti-mobile', '050 123 45 67')).toBe('tel:0501234567')
    expect(contactHref(undefined, '+380501234567')).toBe('tel:+380501234567')
    expect(contactHref('ti-mobile', 'ask in the shop')).toBeUndefined()
  })

  it('opens Viber and WhatsApp with the digits of the number', () => {
    expect(contactHref('ti-viber', '+380 50 123 45 67')).toBe('viber://chat?number=%2B380501234567')
    expect(contactHref('ti-whatsapp', '+380 50 123 45 67')).toBe('https://wa.me/380501234567')
  })

  it('opens Telegram by handle, link or number', () => {
    expect(contactHref('ti-telegram', '@zlata_fashion')).toBe('https://t.me/zlata_fashion')
    expect(contactHref('ti-telegram', 't.me/zlata_fashion')).toBe('https://t.me/zlata_fashion')
    expect(contactHref('ti-telegram', 'https://t.me/zlata_fashion')).toBe('https://t.me/zlata_fashion')
    expect(contactHref('ti-telegram', '+380501234567')).toBe('https://t.me/+380501234567')
    expect(contactHref('ti-telegram', 'no')).toBeUndefined()
  })

  it('leaves other text as it is', () => {
    expect(contactHref('ti-unknown', 'Kyiv, Main street 1')).toBeUndefined()
  })
})

describe('isRetiredChannel', () => {
  it('knows Skype only', () => {
    expect(isRetiredChannel('ti-skype')).toBe(true)
    expect(isRetiredChannel('ti-viber')).toBe(false)
    expect(isRetiredChannel(undefined)).toBe(false)
  })
})
