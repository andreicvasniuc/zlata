import type { Currency, Locale } from '../types'

const INTL_LOCALES: Record<Locale, string> = { en: 'en-GB', ua: 'uk-UA', ru: 'ru-RU', ro: 'ro-RO' }

// "1 200 €" for a whole-number price; null when the product has no price.
export function formatPrice(
  price: number | null | undefined,
  currency: Currency | null | undefined,
  locale: Locale,
): string | null {
  if (!price || !currency) return null
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
