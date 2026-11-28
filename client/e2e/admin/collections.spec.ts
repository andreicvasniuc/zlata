import { expect, test } from '@playwright/test'
import { cleanup, confirmDialog, dialog, open, row, search, signInWithToken, toast, token, uniqueName } from './support'

test.skip(!token, 'set E2E_ADMIN_TOKEN (see support.ts)')

test.describe.serial('collections', () => {
  const name = uniqueName('collection')
  const renamed = `${name}-renamed`

  test.beforeAll(({ request }) => cleanup(request))
  test.afterAll(({ request }) => cleanup(request))
  test.beforeEach(({ page }) => signInWithToken(page))

  test('the next page loads when the grid is scrolled to the end', async ({ page }) => {
    await open(page, '/collections')
    const rows = page.getByTestId('grid').getByRole('row')
    await expect(rows).toHaveCount(11) // header + the first page of 10
    const total = Number(((await page.getByTestId('grid-count').textContent()) ?? '').split(' ')[0])
    test.skip(total <= 10, 'needs more than one page of collections in the local data')

    await page.getByTestId('grid').evaluate((element) => element.scrollTo(0, element.scrollHeight))
    await expect.poll(() => rows.count()).toBeGreaterThan(11)
  })

  test('create a collection and upload its image by URL', async ({ page }) => {
    await open(page, '/collections')
    await page.getByTestId('add').click()

    await expect(dialog(page)).toContainText('Create Collection')
    await expect(dialog(page).getByRole('tab', { name: 'Image uploading' })).toBeDisabled()
    await dialog(page).getByLabel('Name').fill(name)
    await dialog(page).getByLabel('Description').fill('created by an e2e spec')
    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page)).toContainText('Collection was created successfully.')

    // the image tab opens right after the collection exists
    await dialog(page).getByTestId('image-url').fill('https://example.test/e2e-cover.jpg')
    await dialog(page).getByTestId('image-upload').click()
    await expect(dialog(page).getByTestId('image-preview').locator('img')).toHaveAttribute(
      'src',
      'https://example.test/e2e-cover.jpg',
    )
    await dialog(page).getByTestId('editor-close').click()

    await search(page, name)
    const created = row(page, name)
    await expect(created).toBeVisible()
    await expect(created).toContainText('created by an e2e spec')
    await expect(created.locator('img')).toHaveAttribute('src', 'https://example.test/e2e-cover.jpg')
    await expect(page.getByTestId('grid-count')).toHaveText(/^\d+ items?$/)
  })

  test('edit it', async ({ page }) => {
    await open(page, `/collections/sort/updated_at/desc/search/${name}`)
    await row(page, name).getByTestId('edit').click()

    await expect(dialog(page)).toContainText('Edit Collection')
    await expect(dialog(page).getByLabel('Name')).toHaveValue(name)
    await dialog(page).getByLabel('Name').fill(renamed)
    await dialog(page).getByLabel('Accessories').check()
    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page)).toContainText('Collection was updated successfully.')
    await expect(dialog(page)).toBeHidden()

    await search(page, renamed)
    await expect(row(page, renamed)).toBeVisible()
  })

  test('publish and unpublish from the grid', async ({ page }) => {
    await open(page, `/collections/sort/updated_at/desc/search/${renamed}`)
    const toggle = row(page, renamed).getByTestId('published-toggle')

    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await toggle.click()
    await expect(toast(page)).toContainText('Collection was published successfully.')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await toggle.click()
    await expect(toast(page).last()).toContainText('Collection was unpublished successfully.')
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  })

  test('sorting and searching live in the URL', async ({ page }) => {
    await open(page, '/collections')
    await page.getByRole('columnheader', { name: 'Name' }).click()
    await expect(page).toHaveURL(/\/collections\/sort\/name\/(asc|desc)\/search$/)

    await page.getByTestId('search-input').fill(renamed)
    await page.getByTestId('search-button').click()
    await expect(page).toHaveURL(new RegExp(`/search/${renamed}$`))
    await expect(row(page, renamed)).toBeVisible()

    await page.getByTestId('search-clear').click()
    await expect(page).toHaveURL(/\/search$/)
    await expect(page.getByTestId('search-input')).toHaveValue('')
  })

  test('the products link opens the collection', async ({ page }) => {
    await open(page, `/collections/sort/updated_at/desc/search/${renamed}`)
    await row(page, renamed).getByTitle('Go to products').click()
    await expect(page).toHaveURL(/\/collection\/.+\/products$/)
    await expect(page.getByTestId('parent-heading')).toContainText(renamed)
  })

  test('delete it after a confirmation', async ({ page }) => {
    await open(page, `/collections/sort/updated_at/desc/search/${renamed}`)
    await row(page, renamed).getByTestId('delete').click()
    await expect(page.getByRole('alertdialog')).toContainText('Deleting this collection')
    await confirmDialog(page)

    await expect(toast(page)).toContainText('Collection was deleted successfully.')
    await expect(row(page, renamed)).toHaveCount(0)
    await expect(page.getByTestId('empty')).toHaveText('No records found')
  })
})
