import { expect, test } from '@playwright/test'
import { cleanup, confirmDialog, dialog, open, row, signInWithToken, toast, token, uniqueName } from './support'

test.skip(!token, 'set E2E_ADMIN_TOKEN (see support.ts)')

const auth = () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })

test.describe.serial('products', () => {
  const collectionName = uniqueName('products-collection')
  const name = uniqueName('product')
  const renamed = `${name}-renamed`
  const size = uniqueName('size')
  const sizeRenamed = `${size}-xl`
  const color = uniqueName('color')
  let base = ''

  test.beforeAll(async ({ request }) => {
    await cleanup(request)
    const response = await request.post('/en/admin/collections', {
      headers: auth(),
      data: { collection: { name: collectionName, published: true } },
    })
    const collection = (await response.json()) as { slug: string }
    base = `/collection/${collection.slug}/products`
  })
  test.afterAll(({ request }) => cleanup(request))
  test.beforeEach(({ page }) => signInWithToken(page))

  test('the products page without a collection lets you pick one', async ({ page }) => {
    await open(page, '/products')
    await page.getByTestId('parent-select').click()
    await page.getByRole('option', { name: collectionName }).click()
    await expect(page).toHaveURL(new RegExp(`${base}$`))
    await expect(page.getByTestId('parent-heading')).toContainText(collectionName)
    await expect(page.getByTestId('empty')).toBeVisible()
  })

  test('create a product with a new size and color', async ({ page }) => {
    await open(page, base)
    await page.getByTestId('add').click()
    await expect(dialog(page)).toContainText('Create Product')
    await dialog(page).getByLabel('Name').fill(name)

    // sizes and colors are managed in a popover next to the select
    await dialog(page).getByTestId('add-size').click()
    await page.getByTestId('item-new').fill(size)
    await page.getByTestId('item-new').press('Enter')
    await expect(page.getByTestId('item-name').filter({ hasText: size })).toBeVisible()

    // rename it: click the name, edit, Enter
    await page.getByTestId('item-name').filter({ hasText: size }).click()
    await page.getByTestId('item-edit').fill(sizeRenamed)
    await page.getByTestId('item-edit').press('Enter')
    await expect(page.getByTestId('item-name').filter({ hasText: sizeRenamed })).toBeVisible()
    await page.keyboard.press('Escape')

    await dialog(page).getByTestId('add-color').click()
    await page.getByTestId('item-new').fill(color)
    await page.getByTestId('item-new').press('Enter')
    await expect(page.getByTestId('item-name').filter({ hasText: color })).toBeVisible()
    await page.keyboard.press('Escape')

    await dialog(page)
      .locator('.p-multiselect', { has: page.locator('#product-sizes') })
      .click()
    await page.getByRole('option', { name: sizeRenamed }).click()
    await page.keyboard.press('Escape')
    await dialog(page)
      .locator('.p-multiselect', { has: page.locator('#product-colors') })
      .click()
    await page.getByRole('option', { name: color }).click()
    await page.keyboard.press('Escape')
    await dialog(page).getByLabel('Top product').check()

    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page)).toContainText('Product was created successfully.')
    await expect(dialog(page).getByRole('tab', { name: 'Image uploading' })).toHaveAttribute('aria-selected', 'true')
  })

  test('add images by URL, change the cover and delete one', async ({ page }) => {
    await open(page, base)
    await row(page, name).getByTestId('upload').click()
    const images = dialog(page).getByTestId('product-image')

    await dialog(page).getByTestId('image-url').fill('https://example.test/e2e-1.jpg')
    await dialog(page).getByTestId('image-upload').click()
    await expect(images).toHaveCount(1)
    // the first image becomes the cover
    await expect(images.first()).toContainText('Cover')

    await dialog(page).getByTestId('image-url').fill('https://example.test/e2e-2.jpg')
    await dialog(page).getByTestId('image-upload').click()
    await expect(images).toHaveCount(2)
    await expect(images.nth(1)).toContainText('make cover')

    await images.nth(1).getByTestId('image-cover').check()
    await expect(toast(page).last()).toContainText('The image was made as cover successfully.')
    await expect(images.nth(1)).toContainText('Cover')
    await expect(images.first()).toContainText('make cover')

    await images.first().getByTestId('image-delete').click()
    await expect(page.getByRole('alertdialog')).toContainText('delete this image')
    await confirmDialog(page)
    await expect(images).toHaveCount(1)
    await dialog(page).getByTestId('editor-close').click()

    await expect(row(page, name).locator('img')).toHaveAttribute('src', 'https://example.test/e2e-2.jpg')
  })

  test('edit the product and keep its size and color', async ({ page }) => {
    await open(page, base)
    await row(page, name).getByTestId('edit').click()
    await expect(dialog(page).getByLabel('Name')).toHaveValue(name)
    await expect(dialog(page)).toContainText(sizeRenamed)
    await expect(dialog(page)).toContainText(color)
    await dialog(page).getByLabel('Name').fill(renamed)
    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page).last()).toContainText('Product was updated successfully.')
    await expect(row(page, renamed)).toBeVisible()
  })

  test('publish from the grid, search and sort in the browser', async ({ page }) => {
    await open(page, base)
    const toggle = row(page, renamed).getByTestId('published-toggle')
    await toggle.click()
    await expect(toast(page).last()).toContainText('Product was published successfully.')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await page.getByTestId('search-input').fill('nothing-like-this')
    await page.getByTestId('search-input').press('Enter')
    await expect(page.getByTestId('empty')).toBeVisible()
    await page.getByTestId('search-clear').click()
    await expect(row(page, renamed)).toBeVisible()

    await page.getByRole('columnheader', { name: 'Name' }).click()
    await expect(page).toHaveURL(/\/sort\/name\/(asc|desc)\/search$/)
  })

  test('set a price, see it in the grid and on the public product page, then clear it', async ({ page }) => {
    const collectionSlug = base.split('/')[2]
    await open(page, base)
    await row(page, renamed).getByTestId('edit').click()
    await dialog(page).getByLabel('Price').fill('1200')
    await dialog(page).getByLabel('Price').press('Tab')
    await expect(dialog(page).getByLabel('Currency')).toBeEnabled()
    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page).last()).toContainText('Product was updated successfully.')
    await expect(row(page, renamed)).toContainText('€1,200')

    await page.goto(`/en/${collectionSlug}/${renamed}`)
    await expect(page.getByTestId('product-price')).toContainText('from €1,200')

    await open(page, base)
    await row(page, renamed).getByTestId('edit').click()
    await dialog(page).getByLabel('Price').fill('')
    await dialog(page).getByLabel('Price').press('Tab')
    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page).last()).toContainText('Product was updated successfully.')
    await expect(row(page, renamed)).not.toContainText('€')

    await page.goto(`/en/${collectionSlug}/${renamed}`)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(renamed)
    await expect(page.getByTestId('product-price')).toHaveCount(0)
  })

  test('delete the product and the size', async ({ page }) => {
    await open(page, base)
    await row(page, renamed).getByTestId('delete').click()
    await expect(page.getByRole('alertdialog')).toContainText('delete all uploaded images')
    await confirmDialog(page)
    await expect(toast(page).last()).toContainText('Product was deleted successfully.')
    await expect(row(page, renamed)).toHaveCount(0)

    await page.getByTestId('add').click()
    await dialog(page).getByTestId('add-size').click()
    await page.getByTestId('item-name').filter({ hasText: sizeRenamed }).click()
    await page.getByTestId('item-edit').fill('')
    await page.getByTestId('item-edit').press('Enter')
    await expect(page.getByRole('alertdialog')).toContainText('delete this size')
    await confirmDialog(page)
    await expect(page.getByTestId('item-name').filter({ hasText: sizeRenamed })).toHaveCount(0)
  })
})
