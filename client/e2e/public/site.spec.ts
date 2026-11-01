import { expect, test } from '@playwright/test'
import { LOCALES, findCatalog, messages, pageTitle, siteName, stubExternalImages, type Locale } from './helpers'

// Smoke tests of the public site against the Vite dev server and the Rails API with the local data copy:
//   E2E_BASE_URL=http://localhost:5175 pnpm exec playwright test e2e/public

type Catalog = Awaited<ReturnType<typeof findCatalog>>
let catalog: Catalog

// the HTML language code of a locale (Ukrainian is `ua` in URLs and `uk` in the document)
const htmlLang = (locale: Locale) => (locale === 'ua' ? 'uk' : locale)

test.beforeAll(async ({ request }) => {
  catalog = await findCatalog(request)
})

test.beforeEach(async ({ page }) => {
  await stubExternalImages(page)
})

for (const locale of LOCALES) {
  test.describe(`locale ${locale}`, () => {
    const text = messages[locale]

    test('home: hero, categories, featured dresses, menu and footer', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(`/${locale}`)

      await expect(page).toHaveTitle(siteName(locale))
      await expect(page.locator('html')).toHaveAttribute('lang', htmlLang(locale))
      await expect(page.getByRole('heading', { level: 1, name: text.HOME_HERO_TITLE as string })).toBeVisible()
      await expect(page.locator('.shortcuts a').first()).toBeVisible()
      await expect(page.locator('.featured .item-card-name').first()).toBeVisible()
      expect(await page.locator('.featured .item-card').count()).toBeLessThanOrEqual(8)
      await expect(page.locator('.main-menu a').first()).toHaveText(text.COLLECTIONS as string)
      await expect(page.locator('.site-footer')).toBeVisible()
    })

    test('collections and accessories list their collections with visible names', async ({ page }) => {
      await page.goto(`/${locale}/collections`)
      await expect(page).toHaveTitle(pageTitle(locale, 'ALL_COLLECTIONS'))
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(text.ALL_COLLECTIONS as string)
      await expect(page.locator('.breadcrumb li')).toHaveCount(2)
      await expect(page.locator('.item-card-name').first()).toBeVisible()

      await page.goto(`/${locale}/accessories`)
      await expect(page).toHaveTitle(pageTitle(locale, 'ALL_ACCESSORIES'))
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(text.ALL_ACCESSORIES as string)
    })

    test('a collection lists its products', async ({ page }) => {
      await page.goto(`/${locale}/${catalog.collection}`)

      await expect(page).toHaveTitle(`${catalog.collectionName} | ${siteName(locale)}`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(catalog.collectionName)
      await expect(page.locator('.item-card')).toHaveCount(catalog.productCount)
      await expect(page.locator('.breadcrumb li').last()).toHaveText(catalog.collectionName)
    })

    test('a product shows its details, gallery and an enquiry action', async ({ page }) => {
      await page.goto(`/${locale}/${catalog.collection}/${catalog.product}`)

      await expect(page).toHaveTitle(`${catalog.productName} | ${siteName(locale)}`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(catalog.productName)
      await expect(page.locator('.breadcrumb li')).toHaveCount(4)
      await expect(page.locator('.gallery')).toBeVisible()
      await expect(page.locator('.product-info a', { hasText: text.ENQUIRE_DRESS as string })).toBeVisible()
    })

    test('contacts: labelled form and contact groups', async ({ page }) => {
      await page.goto(`/${locale}/contacts`)

      await expect(page).toHaveTitle(pageTitle(locale, 'CONTACTS'))
      await expect(page.getByLabel(text.NAME as string)).toBeVisible()
      await expect(page.getByRole('button', { name: text.SEND as string })).toBeEnabled()
      await expect(page.locator('.contact-group').first()).toBeVisible()
    })

    test('about has its own page', async ({ page }) => {
      await page.goto(`/${locale}/about`)

      await expect(page).toHaveTitle(pageTitle(locale, 'ABOUT'))
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(text.ABOUT as string)
    })

    test('an unknown collection shows the not-found state with a way back', async ({ page }) => {
      await page.goto(`/${locale}/no-such-collection-xyz`)

      await expect(page).toHaveTitle(pageTitle(locale, 'NOT_FOUND'))
      await expect(page.getByText(text.NOT_FOUND_TEXT as string)).toBeVisible()
      await expect(page.getByRole('link', { name: text.BROWSE_DRESSES as string })).toBeVisible()
    })
  })
}

test.describe('language', () => {
  test('the URL locale wins over the saved language, which wins over the default', async ({
    page,
    context,
    baseURL,
  }) => {
    // saved by the old site
    await context.addCookies([{ name: 'NG_TRANSLATE_LANG_KEY', value: 'ru', url: String(baseURL) }])

    await page.goto('/contacts')
    await expect(page).toHaveTitle(pageTitle('ru', 'CONTACTS'))

    await page.goto('/ro/contacts')
    await expect(page).toHaveTitle(pageTitle('ro', 'CONTACTS'))

    // the choice sticks for unprefixed URLs
    await page.goto('/contacts')
    await expect(page).toHaveTitle(pageTitle('ro', 'CONTACTS'))
  })

  test('without any preference the site is in Ukrainian', async ({ page }) => {
    await page.goto('/contacts')
    await expect(page).toHaveTitle(pageTitle('ua', 'CONTACTS'))
    await expect(page.locator('html')).toHaveAttribute('lang', 'uk')
  })

  test('the language selector keeps the current page and puts the locale in the URL', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`/ua/${catalog.collection}/${catalog.product}`)
    await page.locator('.site-header .language-toggle').click()
    await page.locator('.site-header .language-list button[data-locale="en"]').click()

    await expect(page).toHaveURL(new RegExp(`/en/${catalog.collection}/${catalog.product}$`))
    await expect(page.locator('.breadcrumb a').nth(1)).toHaveText(messages.en.ALL_COLLECTIONS as string)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('internal links keep the locale prefix', async ({ page }) => {
    await page.goto('/ro/collections')
    await page.locator('.item-card a').first().click()

    await expect(page).toHaveURL(/\/ro\/[^/]+$/)
    await expect(page.locator('.breadcrumb a').nth(1)).toHaveText(messages.ro.ALL_COLLECTIONS as string)
  })
})

test.describe('navigation', () => {
  test('previous / next walk through the products of the collection', async ({ page }) => {
    test.skip(catalog.productCount < 2, 'needs a collection with two published products')
    await page.goto(`/${catalog.collection}/${catalog.product}`)
    const position = page.locator('.navigation .position')
    await expect(position).toHaveText(new RegExp(`^[0-9]+ / ${catalog.productCount}$`))
    const current = Number.parseInt((await position.textContent()) ?? '', 10)

    // go forward, or back from the last product
    const forward = current < catalog.productCount
    await page.locator(`.navigation a.${forward ? 'arrow-right' : 'arrow-left'}`).click()

    await expect(position).toHaveText(`${forward ? current + 1 : current - 1} / ${catalog.productCount}`)
    await expect(page).not.toHaveURL(new RegExp(`/${catalog.product}$`))
  })

  test('the desktop menu marks the current page and the header stays visible when scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 700 })
    await page.goto('/ua/contacts')
    await expect(page.locator('.main-menu li.active a')).toHaveText(messages.ua.CONTACTS as string)

    await page.evaluate(() => window.scrollTo(0, 400))
    await expect(page.locator('.site-header')).toBeInViewport()
  })

  test('the language list opens on click and closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/ua/contacts')
    const list = page.locator('.site-header .language-list')
    await expect(list).toBeHidden()

    await page.locator('.site-header .language-toggle').click()
    await expect(list).toBeVisible()
    await expect(list.locator('button')).toHaveCount(4)

    await page.keyboard.press('Escape')
    await expect(list).toBeHidden()
  })

  test('returning from a product restores the scroll position of the collection', async ({ page }) => {
    test.skip(catalog.productCount < 8, 'needs a collection long enough to scroll')
    await page.setViewportSize({ width: 1440, height: 800 })
    await page.goto(`/${catalog.collection}`)
    await page.evaluate(() => window.scrollTo(0, 600))
    const before = await page.evaluate(() => window.scrollY)

    await page.locator('.item-card a').last().click()
    await expect(page.locator('.product')).toBeVisible()
    await page.goBack()
    await expect(page.locator('.item-card').first()).toBeVisible()

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before - 50)
  })
})

test.describe('mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('the menu opens as a drawer, closes with Escape and returns the focus', async ({ page }) => {
    await page.goto('/ua/contacts')
    await expect(page.locator('.main-menu')).toBeHidden()

    await page.locator('.menu-button').click()
    await expect(page.locator('#mobile-menu')).toBeVisible()
    await expect(page.locator('.drawer-close')).toBeFocused()
    await expect(page.locator('#mobile-menu a', { hasText: messages.ua.COLLECTIONS as string })).toBeVisible()
    await expect(page.locator('body')).toHaveClass(/menu-open/)

    await page.keyboard.press('Escape')
    await expect(page.locator('#mobile-menu')).toBeHidden()
    await expect(page.locator('.menu-button')).toBeFocused()
    await expect(page.locator('body')).not.toHaveClass(/menu-open/)
  })

  test('choosing a destination closes the drawer', async ({ page }) => {
    await page.goto('/ua/contacts')
    await page.locator('.menu-button').click()
    await page.locator('#mobile-menu a', { hasText: messages.ua.ABOUT as string }).click()

    await expect(page).toHaveURL(/\/ua\/about$/)
    await expect(page.locator('#mobile-menu')).toBeHidden()
  })

  test('the backdrop closes the drawer', async ({ page }) => {
    await page.goto('/ua/contacts')
    await page.locator('.menu-button').click()
    await page.locator('.drawer-backdrop').click({ position: { x: 360, y: 400 } })

    await expect(page.locator('#mobile-menu')).toBeHidden()
  })

  test('a product shows its details right after the first photo, with a persistent enquiry action', async ({
    page,
  }) => {
    await page.goto(`/ua/${catalog.collection}/${catalog.product}`)
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    expect((await heading.boundingBox())!.y).toBeLessThan(812 * 1.6)

    const bar = page.locator('.enquiry-bar a')
    await expect(bar).toBeInViewport()
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(bar).toBeInViewport()
  })
})

test.describe('enquiry from a product', () => {
  test('carries the dress into the contact form', async ({ page }) => {
    await page.goto(`/en/${catalog.collection}/${catalog.product}`)
    await page.locator('.product-info a.enquire-inline, .product-info a.btn-primary').first().click()

    await expect(page).toHaveURL(
      new RegExp(`/en/contacts\\?collection=${catalog.collection}&product=${catalog.product}`),
    )
    await expect(page.locator('.contact-context')).toContainText(catalog.productName)
    await expect(page.getByLabel(messages.en.MESSAGE as string)).toHaveValue(
      new RegExp(`${catalog.collection}/${catalog.product}`),
    )
  })
})

test.describe('contact form', () => {
  const fill = async (page: import('@playwright/test').Page, locale: Locale) => {
    const text = messages[locale]
    await page.getByLabel(text.NAME as string).fill('Anna Test')
    await page.getByLabel(text.EMAIL as string).fill('anna@example.com')
    await page.getByLabel(text.PHONE as string).fill('+380501234567')
    await page.getByLabel(text.MESSAGE as string).fill('Hello from the e2e test')
  }

  test('explains what is missing, posts the message and confirms it (stubbed: no mail is sent)', async ({ page }) => {
    const posted: unknown[] = []
    await page.route('**/api/contacts/send_form', async (route) => {
      posted.push(route.request().postDataJSON())
      await route.fulfill({ json: { contact: {} } })
    })
    await page.goto('/en/contacts')

    const send = page.getByRole('button', { name: messages.en.SEND as string })
    await send.click()
    await expect(page.getByText(messages.en.NAME_REQUIRED as string)).toBeVisible()
    expect(posted).toEqual([])

    await page.getByLabel(messages.en.EMAIL as string).fill('anna@')
    await page.getByLabel(messages.en.EMAIL as string).blur()
    await expect(page.getByText(messages.en.EMAIL_INVALID as string)).toBeVisible()

    await fill(page, 'en')
    await send.click()

    await expect(page.getByText(messages.en.MESSAGE_SENT as string)).toBeVisible()
    expect(posted).toEqual([
      {
        contact: {
          name: 'Anna Test',
          email: 'anna@example.com',
          phone: '+380501234567',
          message: 'Hello from the e2e test',
        },
      },
    ])
    await expect(page.getByLabel(messages.en.NAME as string)).toHaveValue('')
  })

  test('shows an error and keeps the text when sending fails', async ({ page }) => {
    await page.route('**/api/contacts/send_form', (route) => route.fulfill({ status: 500, body: 'oops' }))
    await page.goto('/ua/contacts')
    await fill(page, 'ua')
    await page.getByRole('button', { name: messages.ua.SEND as string }).click()

    await expect(page.getByText(messages.ua.MESSAGE_FAILED as string)).toBeVisible()
    await expect(page.getByLabel(messages.ua.NAME as string)).toHaveValue('Anna Test')
    await expect(page.getByLabel(messages.ua.MESSAGE as string)).toHaveValue('Hello from the e2e test')
  })
})

test.describe('product gallery', () => {
  test('switches pictures and opens them in a lightbox', async ({ page }) => {
    await page.goto(`/${catalog.collection}/${catalog.product}`)
    await expect(page.locator('.gallery')).toBeVisible()
    test.skip((await page.locator('.gallery-main img').count()) === 0, 'the product has no pictures')

    if ((await page.locator('.gallery-thumb').count()) > 1) {
      await page.locator('.gallery-thumb').nth(1).click()
      await expect(page.locator('.gallery-thumb').nth(1)).toHaveAttribute('aria-current', 'true')
    }

    await page.locator('.gallery-main').click()
    await expect(page.locator('.pswp--open')).toBeVisible()
    // Escape is ignored while PhotoSwipe is still opening, so keep pressing it until it closes
    await expect(async () => {
      await page.keyboard.press('Escape')
      await expect(page.locator('.pswp--open')).toHaveCount(0, { timeout: 1000 })
    }).toPass()
  })
})
