import { mkdirSync } from 'node:fs'
import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

// Screenshots of the NEW public site, taken exactly like e2e/baseline/old-site.capture.ts takes them of the old one
// (same pages, locales, viewports and file names) so the two sets can be compared with e2e/visual/compare.ts.
// Written to e2e/visual-screenshots (gitignored).

const OUT = 'e2e/visual-screenshots'
const LOCALES = ['en', 'ua', 'ru', 'ro'] as const
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 375, height: 812 },
} as const

// The old site's language cookie is still honoured as the "saved preference" of the new one.
const LANGUAGE_COOKIE = 'NG_TRANSLATE_LANG_KEY'

interface Named {
  slug: string
}

const get = async <T>(request: APIRequestContext, path: string): Promise<T> => {
  const response = await request.get(path)
  expect(response.ok(), `GET ${path}`).toBeTruthy()
  return response.json() as Promise<T>
}

async function shoot(page: Page, path: string, file: string) {
  await page.goto(path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500) // let the views and images settle
  await page.screenshot({ path: file, fullPage: true, animations: 'disabled' })
}

async function setLanguage(page: Page, locale: string) {
  await page
    .context()
    .addCookies([{ name: LANGUAGE_COOKIE, value: locale, url: String(test.info().project.use.baseURL) }])
}

test.describe('public site', () => {
  let pages: Record<string, string> = {}

  test.beforeAll(async ({ request }) => {
    const { collections: dresses } = await get<{ collections: Named[] }>(request, '/ua/api/collections/dresses')
    const { collections: accessories } = await get<{ collections: Named[] }>(request, '/ua/api/collections/accessories')
    const firstWithProducts = async (list: Named[]) => {
      for (const { slug } of list) {
        const { collection } = await get<{ collection: { products: Named[] } }>(request, `/ua/api/collections/${slug}`)
        const product = collection.products.find((item) => item.slug)
        if (product) return { collection: slug, product: product.slug }
      }
      return undefined
    }
    const dress = await firstWithProducts(dresses)
    const accessory = await firstWithProducts(accessories)

    pages = { home: '/', collections: '/collections', accessories: '/accessories', contacts: '/contacts' }
    if (dress) {
      pages['collection-dresses'] = `/${dress.collection}`
      pages['product-dress'] = `/${dress.collection}/${dress.product}`
    }
    if (accessory) {
      pages['collection-accessories'] = `/${accessory.collection}`
      pages['product-accessory'] = `/${accessory.collection}/${accessory.product}`
    }
  })

  for (const locale of LOCALES) {
    for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
      test(`${locale} ${viewportName}`, async ({ page }) => {
        mkdirSync(`${OUT}/public`, { recursive: true })
        await page.setViewportSize(viewport)
        await setLanguage(page, locale)
        for (const [name, path] of Object.entries(pages)) {
          await shoot(page, path, `${OUT}/public/${locale}-${viewportName}-${name}.png`)
        }
      })
    }
  }
})
