import { useI18n } from 'vue-i18n'
import { formatPrice } from '@shared/format/price'
import type { Locale, Product } from '@shared/types'

// "from 1 200 €" in the current language; undefined when the product has no price.
export function usePriceLabel() {
  const { t, locale } = useI18n()
  return (product: Pick<Product, 'price' | 'currency'>): string | undefined => {
    const price = formatPrice(product.price, product.currency, locale.value as Locale)
    return price ? `${t('PRICE_FROM')} ${price}` : undefined
  }
}
