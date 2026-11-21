import type { ContactGroup } from '@shared/types'

// Why the visitor opens the contact form: a fitting request or a question (`/contacts?intent=fitting&dress=…`).
export type ContactIntent = 'fitting' | 'question'

export const contactsQuery = (intent: ContactIntent, dresses: string[] = []) =>
  dresses.length ? { intent, dress: dresses.join(', ') } : { intent }

// PLACEHOLDER: replace with the salon's real map location (a street address or "lat,lng") once the owner confirms it.
// The address and the opening hours are the SALON_ADDRESS and SALON_HOURS strings of the locale files.
export const SALON_MAP_QUERY = 'Zlata wedding fashion'

const mapQuery = encodeURIComponent(SALON_MAP_QUERY)
export const SALON_MAP_EMBED_URL = `https://www.google.com/maps?q=${mapQuery}&output=embed`
export const SALON_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`

const kindOf = (group: Pick<ContactGroup, 'slug' | 'css_class'>) =>
  `${group.slug ?? ''} ${group.css_class ?? ''}`.toLowerCase()

// Skype is no longer offered on the site; the admin can keep the group.
export const isShownContactGroup = (group: Pick<ContactGroup, 'slug' | 'css_class'>) => !kindOf(group).includes('skype')

// A link that opens the right app for a contact: mail, Viber or the phone.
export function contactHref(group: Pick<ContactGroup, 'slug' | 'css_class'>, value: string): string | undefined {
  const kind = kindOf(group)
  const text = value.trim()
  if (kind.includes('mail') || /^[^\s@]+@[^\s@]+$/.test(text)) return `mailto:${text}`
  const phone = text.replace(/[^\d+]/g, '')
  if (!phone) return undefined
  if (kind.includes('viber')) return `viber://chat?number=${encodeURIComponent(phone)}`
  if (kind.includes('phone') || kind.includes('tel') || kind.includes('whatsapp')) return `tel:${phone}`
  return undefined
}
