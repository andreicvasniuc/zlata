import { expect, test } from '@playwright/test'
import { cleanup, confirmDialog, dialog, open, row, search, signInWithToken, toast, token, uniqueName } from './support'

test.skip(!token, 'set E2E_ADMIN_TOKEN (see support.ts)')

test.describe.serial('social networkings', () => {
  const name = uniqueName('social')
  const renamed = `${name}-renamed`

  test.beforeAll(({ request }) => cleanup(request))
  test.afterAll(({ request }) => cleanup(request))
  test.beforeEach(({ page }) => signInWithToken(page))

  test('create one with an icon class', async ({ page }) => {
    await open(page, '/social-networkings')
    await page.getByTestId('add').click()
    await expect(dialog(page)).toContainText('Create Social networking')

    // name and URL are required
    await expect(dialog(page).getByTestId('editor-save')).toBeDisabled()
    await dialog(page).getByLabel('Name').fill(name)
    await expect(dialog(page).getByTestId('editor-save')).toBeDisabled()
    await dialog(page).getByLabel('Url').fill('https://example.test/e2e-social')
    await dialog(page).locator('#sn-css-class').click()
    await page.getByRole('option', { name: 'Telegram' }).click()
    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page)).toContainText('Social networking was created successfully.')
    await expect(dialog(page)).toBeHidden()

    await search(page, name)
    await expect(row(page, name)).toContainText('https://example.test/e2e-social')
  })

  test('edit it and toggle publishing', async ({ page }) => {
    await open(page, `/social-networkings/sort/updated_at/desc/search/${name}`)
    await row(page, name).getByTestId('edit').click()
    await expect(dialog(page).getByLabel('Name')).toHaveValue(name)
    await expect(dialog(page)).toContainText('Telegram')
    await dialog(page).getByLabel('Name').fill(renamed)
    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page).last()).toContainText('Social networking was updated successfully.')

    await search(page, renamed)
    const toggle = row(page, renamed).getByTestId('published-toggle')
    await toggle.click()
    await expect(toast(page).last()).toContainText('Social networking was published successfully.')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  test('sort by URL, then delete it', async ({ page }) => {
    await open(page, `/social-networkings/sort/updated_at/desc/search/${renamed}`)
    await page.getByRole('columnheader', { name: 'Url' }).click()
    await expect(page).toHaveURL(/\/sort\/url\/(asc|desc)\/search\//)

    await row(page, renamed).getByTestId('delete').click()
    await confirmDialog(page)
    await expect(toast(page).last()).toContainText('Social networking was deleted successfully.')
    await expect(row(page, renamed)).toHaveCount(0)
  })
})
