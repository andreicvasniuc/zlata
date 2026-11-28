import { expect, test } from '@playwright/test'
import { BASE, token } from './support'

const email = process.env.E2E_ADMIN_EMAIL
const password = process.env.E2E_ADMIN_PASSWORD

test.describe('login', () => {
  // texts are asserted in English; the default language is Ukrainian
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('zlata.locale', 'en'))
  })

  test('an unknown user sees the error and no token is stored (404)', async ({ page }) => {
    await page.goto(`${BASE}/login`)
    await page.getByLabel('E-mail').fill('nobody@example.test')
    await page.locator('#login-password').fill('wrong-password')
    const response = page.waitForResponse((r) => r.url().endsWith('/user_token'))
    await page.getByTestId('login-submit').click()

    expect((await response).status()).toBe(404)
    await expect(page.locator('.p-toast-message')).toContainText('Incorrect email or password')
    await expect(page).toHaveURL(`${BASE}/login`)
    expect(await page.evaluate(() => sessionStorage.getItem('auth_token'))).toBeNull()
  })

  test('the form validates before sending anything', async ({ page }) => {
    let called = false
    page.on('request', (request) => (called ||= request.url().endsWith('/user_token')))
    await page.goto(`${BASE}/login`)
    await page.getByTestId('login-submit').click()

    await expect(page.getByLabel('E-mail')).toHaveAttribute('aria-invalid', 'true')
    expect(called).toBe(false)
  })

  test('visiting a page while logged out redirects to the login page', async ({ page }) => {
    await page.goto(`${BASE}/collections`)
    await expect(page).toHaveURL(`${BASE}/login`)
  })

  test('an invalid token is dropped on the first 401 and the user lands on the login page', async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('auth_token', 'not-a-valid-token'))
    await page.goto(`${BASE}/collections`)

    await expect(page).toHaveURL(`${BASE}/login`)
    expect(await page.evaluate(() => sessionStorage.getItem('auth_token'))).toBeNull()
  })

  test('the credential cookies of the old admin are deleted', async ({ page, context }) => {
    await context.addCookies([
      { name: 'email', value: 'someone@example.test', url: 'http://localhost:5174' },
      { name: 'password', value: 'plain-text', url: 'http://localhost:5174' },
    ])
    await page.goto(`${BASE}/login`)
    await expect(page.getByTestId('login-form')).toBeVisible()

    const names = (await context.cookies()).map((cookie) => cookie.name)
    expect(names).not.toContain('email')
    expect(names).not.toContain('password')
  })

  test('valid credentials open the page the user wanted (201)', async ({ page }) => {
    test.skip(!email || !password, 'set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run the successful login')

    await page.goto(`${BASE}/sliders`)
    await expect(page).toHaveURL(`${BASE}/login`)
    await page.getByLabel('E-mail').fill(email ?? '')
    await page.locator('#login-password').fill(password ?? '')
    const response = page.waitForResponse((r) => r.url().endsWith('/user_token'))
    await page.getByTestId('login-submit').click()

    expect((await response).status()).toBe(201)
    await expect(page).toHaveURL(`${BASE}/sliders`)
    expect(await page.evaluate(() => sessionStorage.getItem('auth_token'))).toBeTruthy()
    expect(await page.context().cookies()).toEqual([])
  })

  test('logging out clears the token', async ({ page }) => {
    test.skip(!token, 'set E2E_ADMIN_TOKEN')
    await page.addInitScript((value) => sessionStorage.setItem('auth_token', value ?? ''), token)
    await page.goto(`${BASE}/dashboard`)
    await page.getByTestId('logout').click()

    await expect(page).toHaveURL(`${BASE}/login`)
    expect(await page.evaluate(() => sessionStorage.getItem('auth_token'))).toBeNull()
  })
})
