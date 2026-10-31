import { mkdirSync } from 'node:fs'
import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

// Screenshots of every route of the old apps, written to e2e/baseline-screenshots (gitignored: taken from a local
// copy of the production data). The new apps are compared against them in Phase 3.

const OUT = 'e2e/baseline-screenshots'
const LOCALES = ['en', 'ua', 'ru', 'ro'] as const
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 375, height: 812 },
} as const
const ADMIN_LOCALES = ['en', 'ua'] as const

// angular-translate (cookie storage) keeps the chosen language here
const LANGUAGE_COOKIE = 'NG_TRANSLATE_LANG_KEY'

interface Named {
  slug: string
  products_count?: number
  contacts_count?: number
  slides_count?: number
}

const get = async <T>(request: APIRequestContext, path: string, headers?: Record<string, string>): Promise<T> => {
  const response = await request.get(path, { headers })
  expect(response.ok(), `GET ${path}`).toBeTruthy()
  return response.json() as Promise<T>
}

async function shoot(page: Page, path: string, file: string) {
  await page.goto(path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500) // let the AngularJS views and images settle
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

test.describe('admin', () => {
  const token = process.env.E2E_ADMIN_TOKEN?.trim()
  let pages: Record<string, string> = {}

  test.skip(!token, 'set E2E_ADMIN_TOKEN (see playwright.baseline.config.ts)')

  test.beforeAll(async ({ request }) => {
    const auth = { Authorization: `Bearer ${token}` }
    const lists = async (resource: string) =>
      (await get<Record<string, Named[]>>(request, `/en/admin/${resource}/list`, auth))[resource] ?? []

    const collections = await lists('collections')
    const sliders = await lists('sliders')
    const contactGroups = await lists('contact_groups')

    pages = {
      dashboard: '/dashboard',
      collections: '/collections',
      'social-networkings': '/social-networkings',
      'contact-groups': '/contact-groups',
      sliders: '/sliders',
    }
    if (collections[0]) pages['collection-products'] = `/collection/${collections[0].slug}/products`
    if (contactGroups[0]) pages['contact-group-contacts'] = `/contact-group/${contactGroups[0].slug}/contacts`
    if (sliders[0]) pages['slider-slides'] = `/slider/${sliders[0].slug}/slides`
  })

  for (const locale of ADMIN_LOCALES) {
    test(`${locale} desktop`, async ({ page }) => {
      mkdirSync(`${OUT}/admin`, { recursive: true })
      await page.setViewportSize(VIEWPORTS.desktop)
      await setLanguage(page, locale)
      await page.addInitScript((value) => sessionStorage.setItem('auth_token', value ?? ''), token)
      for (const [name, path] of Object.entries(pages)) {
        await shoot(page, `/admin${path}`, `${OUT}/admin/${locale}-desktop-${name}.png`)
      }
    })
  }

  test('login page', async ({ page }) => {
    mkdirSync(`${OUT}/admin`, { recursive: true })
    await page.setViewportSize(VIEWPORTS.desktop)
    await shoot(page, '/admin/login', `${OUT}/admin/en-desktop-login.png`)
  })
})
