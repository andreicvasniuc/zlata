import { expect, test } from '@playwright/test'
import { BASE, open, signInWithToken, token } from './support'

test.skip(!token, 'set E2E_ADMIN_TOKEN (see support.ts)')

test.describe('admin shell', () => {
  test.beforeEach(({ page }) => signInWithToken(page))

  test('the dashboard links to every section and the sidebar highlights the current one', async ({ page }) => {
    await open(page, '/dashboard')
    await expect(page.getByTestId('dashboard').getByRole('link')).toHaveCount(7)

    await page.getByTestId('sidebar').getByRole('link', { name: 'Sliders' }).click()
    await expect(page).toHaveURL(`${BASE}/sliders`)
    await expect(page.getByRole('heading', { name: 'Sliders' })).toBeVisible()
    await expect(page.getByTestId('sidebar').getByRole('link', { name: 'Sliders' })).toHaveClass(/text-accent/)
  })

  test('unknown paths fall back to the collections', async ({ page }) => {
    await open(page, '/no-such-page')
    await expect(page).toHaveURL(`${BASE}/collections`)
  })

  test('the language selector switches the admin and the choice survives a reload', async ({ page }) => {
    await open(page, '/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

    await page.getByTestId('language-selector').click()
    await page.getByRole('option', { name: 'ua' }).click()
    await expect(page.getByRole('heading', { name: 'Панель приладів' })).toBeVisible()
    expect(await page.evaluate(() => localStorage.getItem('zlata.locale'))).toBe('ua')

    // the API is called in the chosen language: the Ukrainian name of a collection, not the English one
    const request = page.waitForRequest((r) => r.url().includes('/ua/admin/collections/search'))
    await open(page, '/collections')
    await request
  })

  test('Export downloads the data as a JSON file', async ({ page }) => {
    await open(page, '/dashboard')
    const download = page.waitForEvent('download')
    await page.getByTestId('export').click()

    const file = await download
    expect(file.suggestedFilename()).toMatch(/^zlata-export-\d{4}-\d{2}-\d{2}\.json$/)
  })
})
