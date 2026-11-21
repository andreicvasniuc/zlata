import type { ImageFile, Product } from '@shared/types'
import type { GridItem } from './components/ItemGrid.vue'

// The cover picture first, the others in their original order.
export function coverFirst(images: ImageFile[] = []): ImageFile[] {
  return [...images.filter((image) => image.is_cover), ...images.filter((image) => !image.is_cover)]
}

// A colour's name (in any site language) to the shade shown in its swatch; unknown names get no swatch.
const SWATCHES: [RegExp, string][] = [
  [/white|біл|бел|alb/i, '#ffffff'],
  [/ivory|айворі|айвори|слонов|fildeș|fildes/i, '#f6efe2'],
  [/nude|нюд|nud/i, '#e3c4b0'],
  [/cappuccino|капучіно|капучино|cappucino/i, '#c9a98c'],
  [/champagne|шампан/i, '#e8d5b5'],
  [/pink|рожев|розов|roz/i, '#f2cfd2'],
  [/blush|пудр/i, '#efd3cf'],
  [/black|чорн|черн|negru/i, '#1c1a19'],
]

export const colorSwatch = (name: string): string | undefined => SWATCHES.find(([pattern]) => pattern.test(name))?.[1]

// A product as a grid card: cover picture, a second picture for hover, the price line, the "New" label and the heart.
export function productGridItem(product: Product, collectionSlug = product.collection_slug, price?: string): GridItem {
  const url = `/${collectionSlug}/${product.slug}`
  const pictures = coverFirst(product.images)
  const image = product.cover_image?.url ?? pictures[0]?.url
  const hoverImage = pictures.find((picture) => picture.url && picture.url !== image)?.url
  return {
    id: product.id,
    name: product.name,
    url,
    image,
    hoverImage,
    price,
    isNew: isNewProduct(product),
    favourite: { id: product.id, name: product.name, url, image },
  }
}

const NEW_PRODUCT_DAYS = 60

// A product added in the last two months is "new".
export function isNewProduct(product: Pick<Product, 'created_at'>, now = Date.now()): boolean {
  const created = product.created_at ? Date.parse(product.created_at) : NaN
  return Number.isFinite(created) && now - created >= 0 && now - created < NEW_PRODUCT_DAYS * 86_400_000
}
