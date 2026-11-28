import { expect, type APIRequestContext, type Page } from '@playwright/test'
import { PNG } from 'pngjs'
import en from '../../src/shared/locales/app/en.json' with { type: 'json' }
import ro from '../../src/shared/locales/app/ro.json' with { type: 'json' }
import ru from '../../src/shared/locales/app/ru.json' with { type: 'json' }
import ua from '../../src/shared/locales/app/ua.json' with { type: 'json' }

export const LOCALES = ['en', 'ua', 'ru', 'ro'] as const
export type Locale = (typeof LOCALES)[number]
export const messages: Record<Locale, Record<string, string>> = { en, ua, ru, ro }

// A small picture served for every external image (the shop's pictures live on a third-party host that is flaky and
// not needed to check the layout).
const picture = (() => {
  const png = new PNG({ width: 200, height: 300 })
  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = 190
    png.data[i + 1] = 170
    png.data[i + 2] = 160
    png.data[i + 3] = 255
  }
  return PNG.sync.write(png)
})()

export async function stubExternalImages(page: Page) {
  await page.route(/^https?:\/\/(?!localhost)[^/]+\/.*\.(jpe?g|png|webp)(\?.*)?$/i, (route) =>
    route.fulfill({ body: picture, contentType: 'image/png' }),
  )
}

export const siteName = (locale: Locale) => messages[locale].LONG_SITE_NAME as string
export const pageTitle = (locale: Locale, key: string) => `${messages[locale][key]} | ${siteName(locale)}`

interface Catalog {
  collection: string
  collectionName: string
  product: string
  productName: string
  productCount: number
}

// A published collection with products and one of its published products (with pictures if any), from the live API.
export async function findCatalog(request: APIRequestContext): Promise<Catalog> {
  const response = await request.get('/ua/api/collections/dresses')
  expect(response.ok()).toBeTruthy()
  const { collections } = (await response.json()) as { collections: { slug: string }[] }
  for (const { slug } of collections) {
    const detail = await request.get(`/ua/api/collections/${slug}`)
    const { collection } = (await detail.json()) as {
      collection: { name: string; products: { slug: string; name: string; published: boolean; images?: unknown[] }[] }
    }
    const published = collection.products.filter((product) => product.published)
    // prefer a product with pictures so the gallery can be checked
    const product = published.find((item) => item.images?.length) ?? published[0]
    if (product) {
      return {
        collection: slug,
        collectionName: collection.name,
        product: product.slug,
        productName: product.name,
        productCount: published.length,
      }
    }
  }
  throw new Error('No collection with a published product in the data')
}
