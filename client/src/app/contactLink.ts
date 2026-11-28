// Turns the text of a contact (as typed in the admin) into a link that opens the right app. Returns undefined for text
// that has no sensible link, which is then shown as plain text.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^\+?[\d\s().-]{6,}$/

const digitsOf = (value: string) => value.replace(/\D/g, '')

export function contactHref(cssClass: string | undefined, value: string): string | undefined {
  const text = value.trim()
  const digits = digitsOf(text)

  if (cssClass === 'ti-email' || EMAIL.test(text)) return EMAIL.test(text) ? `mailto:${text}` : undefined
  if (cssClass === 'ti-viber') return digits ? `viber://chat?number=%2B${digits}` : undefined
  if (cssClass === 'ti-whatsapp') return digits ? `https://wa.me/${digits}` : undefined
  if (cssClass === 'ti-telegram') {
    if (/^https?:\/\//.test(text)) return text
    if (PHONE.test(text)) return `https://t.me/+${digits}`
    const handle = text.replace(/^@/, '').replace(/^(https?:\/\/)?t\.me\//, '')
    return /^\w{4,}$/.test(handle) ? `https://t.me/${handle}` : undefined
  }
  if (cssClass === 'ti-mobile' || PHONE.test(text)) {
    return digits ? `tel:${text.startsWith('+') ? '+' : ''}${digits}` : undefined
  }
  return undefined
}
