import { expect, test } from '@playwright/test'
import { LOCALES, findCatalog, messages, pageTitle, siteName, stubExternalImages, type Locale } from './helpers'

// Smoke tests of the new public site against the Vite dev server and the Rails API with the local data copy:
//   E2E_BASE_URL=http://localhost:5175 pnpm exec playwright test e2e/public

type Catalog = Awaited<ReturnType<typeof findCatalog>>
let catalog: Catalog

test.beforeAll(async ({ request }) => {
  catalog = await findCatalog(request)
})

test.beforeEach(async ({ page }) => {
  await stubExternalImages(page)
})

for (const locale of LOCALES) {
  test.describe(`locale ${locale}`, () => {
    const text = messages[locale]

    test('home: slider, top dresses, menu and footer', async ({ page }) => {
      await page.goto(`/${locale}`)

      await expect(page).toHaveTitle(siteName(locale))
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      await expect(page.locator('.slide-carousel .embla__slide').first()).toBeVisible()
      await expect(page.getByRole('heading', { level: 1, name: text.TOP_DRESSES })).toBeVisible()
      await expect(page.locator('.top-products .portfolio-item figure').first()).toBeVisible()
      await expect(page.locator('#fh5co-primary-menu > li > a').nth(1)).toHaveText(text.CATALOG as string)
      await expect(page.locator('.fh5co-social-icons li').first()).toBeVisible()
    })

    test('collections and accessories list their collections', async ({ page }) => {
      await page.goto(`/${locale}/collections`)
      await expect(page).toHaveTitle(pageTitle(locale, 'ALL_COLLECTIONS'))
      await expect(page.locator('#fh5co-hero h1')).toHaveText(text.ALL_COLLECTIONS as string)
      await expect(page.locator('.breadcrumb li')).toHaveCount(2)
      await expect(page.locator('.portfolio-item figure').first()).toBeVisible()

      await page.goto(`/${locale}/accessories`)
      await expect(page).toHaveTitle(pageTitle(locale, 'ALL_ACCESSORIES'))
      await expect(page.locator('#fh5co-hero h1')).toHaveText(text.ALL_ACCESSORIES as string)
    })

    test('a collection lists its products', async ({ page }) => {
      await page.goto(`/${locale}/${catalog.collection}`)

      await expect(page).toHaveTitle(`${catalog.collectionName} | ${siteName(locale)}`)
      await expect(page.locator('#fh5co-hero h1')).toHaveText(catalog.collectionName)
      await expect(page.locator('.portfolio-item')).toHaveCount(catalog.productCount)
      await expect(page.locator('.breadcrumb li').last()).toHaveText(catalog.collectionName)
    })

    test('a product shows its details and gallery', async ({ page }) => {
      await page.goto(`/${locale}/${catalog.collection}/${catalog.product}`)

      await expect(page).toHaveTitle(`${catalog.productName} | ${siteName(locale)}`)
      await expect(page.locator('.info h1')).toHaveText(catalog.productName)
      await expect(page.locator('.breadcrumb li')).toHaveCount(4)
      await expect(page.locator('.extra-fields')).toBeVisible()
    })

    test('contacts: form and contact groups', async ({ page }) => {
      await page.goto(`/${locale}/contacts`)

      await expect(page).toHaveTitle(pageTitle(locale, 'CONTACTS'))
      await expect(page.getByPlaceholder(text.NAME as string)).toBeVisible()
      await expect(page.getByRole('button', { name: text.SEND as string })).toBeDisabled()
      await expect(page.locator('.fh5co-feature-blurb li').first()).toBeVisible()
    })

    test('an unknown collection shows the not-found state', async ({ page }) => {
      await page.goto(`/${locale}/no-such-collection-xyz`)

      await expect(page).toHaveTitle(pageTitle(locale, 'NOT_FOUND'))
      await expect(page.getByText(text.NOT_FOUND_TEXT as string)).toBeVisible()
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
  })

  test('the language selector reloads the page in the chosen language, with the locale in the URL', async ({
    page,
  }) => {
    await page.goto(`/ua/${catalog.collection}`)
    await page.locator('.language-selector a[data-locale="en"]').dispatchEvent('click')

    await expect(page).toHaveURL(new RegExp(`/en/${catalog.collection}$`))
    await expect(page.locator('.breadcrumb a').nth(1)).toHaveText(messages.en.ALL_COLLECTIONS as string)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('internal links keep the locale prefix', async ({ page }) => {
    await page.goto('/ro/collections')
    await page.locator('.portfolio-item a').first().click()

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

  test('the Catalog menu opens its sub menu on hover', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/ua/contacts')
    const subMenu = page.locator('#fh5co-primary-menu > li:nth-child(2) .fh5co-sub-menu')
    await expect(subMenu).toBeHidden()

    await page.locator('#fh5co-primary-menu > li:nth-child(2)').hover()
    await expect(subMenu).toBeVisible()
  })

  test('the language list opens on hover', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/ua/contacts')
    const list = page.locator('.language-selector ul')
    await expect(list).toBeHidden()

    await page.locator('.language-selector a.fh5co-sub-ddown').hover()
    await expect(list).toBeVisible()
    await expect(list.locator('a')).toHaveCount(4)
  })

  test('the header turns white after scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 700 })
    await page.goto(`/${catalog.collection}`)
    await expect(page.locator('#fh5co-header-section')).not.toHaveClass(/fh5co-scrolled/)

    await page.evaluate(() => window.scrollTo(0, 200))
    await expect(page.locator('#fh5co-header-section')).toHaveClass(/fh5co-scrolled/)
  })
})

test.describe('mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('the menu slides in from the left and closes on an outside click', async ({ page }) => {
    await page.goto('/ua/contacts')
    await expect(page.locator('#fh5co-header-section')).toHaveCount(0)

    await page.locator('#fh5co-mobile-menu-btn').click()
    await expect(page.locator('body')).toHaveClass(/fh5co-mobile-menu-visible/)
    await expect(page.locator('#fh5co-mobile-menu')).toBeInViewport({ ratio: 0.9 }) // slid in, not just flagged open
    await expect(page.locator('#fh5co-mobile-menu a', { hasText: messages.ua.HOME as string })).toBeVisible()

    await page.locator('#fh5co-main').click({ position: { x: 300, y: 300 }, force: true })
    await expect(page.locator('body')).not.toHaveClass(/fh5co-mobile-menu-visible/)
  })

  test('Catalog expands its sub menu in the mobile menu', async ({ page }) => {
    await page.goto('/ua/contacts')
    await page.locator('#fh5co-mobile-menu-btn').click()
    // (a plain click would scroll the page, which closes the menu, as on the old site)
    await page
      .locator('#fh5co-mobile-menu-ul > li > a', { hasText: messages.ua.CATALOG as string })
      .dispatchEvent('click')

    await expect(
      page.locator('#fh5co-mobile-menu .fh5co-sub-menu a', { hasText: messages.ua.ACCESSORIES as string }),
    ).toBeVisible()
    await expect(page).toHaveURL(/\/ua\/contacts$/)
  })
})

test.describe('contact form', () => {
  const fill = async (page: import('@playwright/test').Page, locale: Locale) => {
    const text = messages[locale]
    await page.getByPlaceholder(text.NAME as string).fill('Anna Test')
    await page.getByPlaceholder(text.EMAIL as string).fill('anna@example.com')
    await page.getByPlaceholder(text.PHONE as string).fill('+380501234567')
    await page.getByPlaceholder(text.MESSAGE as string).fill('Hello from the e2e test')
  }

  test('validates, posts the message and confirms it (the request is stubbed: no mail is sent)', async ({ page }) => {
    const posted: unknown[] = []
    await page.route('**/api/contacts/send_form', async (route) => {
      posted.push(route.request().postDataJSON())
      await route.fulfill({ json: { contact: {} } })
    })
    await page.goto('/en/contacts')

    const send = page.getByRole('button', { name: messages.en.SEND as string })
    await expect(send).toBeDisabled()
    await page.getByPlaceholder(messages.en.EMAIL as string).fill('anna@')
    await page.getByPlaceholder(messages.en.EMAIL as string).blur()
    await expect(page.getByText(messages.en.EMAIL_INVALID as string)).toBeVisible()

    await fill(page, 'en')
    await expect(send).toBeEnabled()
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
    await expect(page.getByPlaceholder(messages.en.NAME as string)).toHaveValue('')
  })

  test('shows an error and keeps the text when sending fails', async ({ page }) => {
    await page.route('**/api/contacts/send_form', (route) => route.fulfill({ status: 500, body: 'oops' }))
    await page.goto('/ua/contacts')
    await fill(page, 'ua')
    await page.getByRole('button', { name: messages.ua.SEND as string }).click()

    await expect(page.getByText(messages.ua.MESSAGE_FAILED as string)).toBeVisible()
    await expect(page.getByPlaceholder(messages.ua.NAME as string)).toHaveValue('Anna Test')
  })
})

test.describe('product gallery', () => {
  test('opens the pictures in a lightbox', async ({ page }) => {
    await page.goto(`/${catalog.collection}/${catalog.product}`)
    await expect(page.locator('.info h1')).toBeVisible()
    test.skip((await page.locator('.gallery a').count()) === 0, 'the product has no pictures')

    await page.locator('.gallery a').first().locator('img').click()
    await expect(page.locator('.pswp--open')).toBeVisible()
    // Escape is ignored while PhotoSwipe is still opening, so keep pressing it until it closes
    await expect(async () => {
      await page.keyboard.press('Escape')
      await expect(page.locator('.pswp--open')).toHaveCount(0, { timeout: 1000 })
    }).toPass()
  })
})
