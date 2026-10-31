import { expect, test } from '@playwright/test'
import { cleanup, confirmDialog, dialog, open, row, search, signInWithToken, toast, token, uniqueName } from './support'

test.skip(!token, 'set E2E_ADMIN_TOKEN (see support.ts)')

test.describe.serial('sliders and slides', () => {
  const slider = uniqueName('slider')
  const sliderRenamed = `${slider}-renamed`
  const slide = uniqueName('slide')
  const slideRenamed = `${slide}-renamed`
  let slidesPath = ''

  test.beforeAll(({ request }) => cleanup(request))
  test.afterAll(({ request }) => cleanup(request))
  test.beforeEach(({ page }) => signInWithToken(page))

  test('create a slider with autoplay', async ({ page }) => {
    await open(page, '/sliders')
    await page.getByTestId('add').click()
    await expect(dialog(page)).toContainText('Create Slider')
    await dialog(page).getByLabel('Name').fill(slider)
    await dialog(page).getByLabel('Autoplay').check()
    await dialog(page).getByTestId('editor-save').click()

    await expect(toast(page)).toContainText('Slider was created successfully.')
    await search(page, slider)
    await expect(row(page, slider)).toContainText('✓')
  })

  test('edit the slider and toggle publishing', async ({ page }) => {
    await open(page, `/sliders/sort/updated_at/desc/search/${slider}`)
    await row(page, slider).getByTestId('edit').click()
    await expect(dialog(page).getByLabel('Autoplay')).toBeChecked()
    await dialog(page).getByLabel('Name').fill(sliderRenamed)
    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page).last()).toContainText('Slider was updated successfully.')

    await search(page, sliderRenamed)
    const toggle = row(page, sliderRenamed).getByTestId('published-toggle')
    await toggle.click()
    await expect(toast(page).last()).toContainText('Slider was published successfully.')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  test('the slides page without a slider lets you pick one', async ({ page }) => {
    await open(page, '/slides')
    await page.getByTestId('parent-select').click()
    await page.getByRole('option', { name: sliderRenamed }).click()
    await expect(page).toHaveURL(/\/slider\/.+\/slides$/)
    slidesPath = new URL(page.url()).pathname.replace('/admin', '')
    await expect(page.getByTestId('parent-heading')).toContainText(sliderRenamed)
  })

  test('create a slide, upload its image, edit, publish', async ({ page }) => {
    await open(page, slidesPath)
    await page.getByTestId('add').click()
    await expect(dialog(page)).toContainText('Create Slide')
    await dialog(page).getByLabel('Title').fill(slide)
    await dialog(page).getByLabel('Link text').fill('See more')
    await dialog(page).getByLabel('Link url').fill('/collections')
    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page)).toContainText('Slide was created successfully.')

    await dialog(page).getByTestId('image-url').fill('https://example.test/e2e-slide.jpg')
    await dialog(page).getByTestId('image-upload').click()
    await expect(dialog(page).getByTestId('image-preview')).toBeVisible()
    await dialog(page).getByTestId('editor-close').click()

    const created = row(page, slide)
    await expect(created).toContainText('See more')
    await expect(created).toContainText('/collections')
    await expect(created.locator('img')).toHaveAttribute('src', 'https://example.test/e2e-slide.jpg')

    await created.getByTestId('edit').click()
    await dialog(page).getByLabel('Title').fill(slideRenamed)
    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page).last()).toContainText('Slide was updated successfully.')

    const toggle = row(page, slideRenamed).getByTestId('published-toggle')
    await toggle.click()
    await expect(toast(page).last()).toContainText('Slide was published successfully.')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  test('clicking the image opens the image tab; delete the slide', async ({ page }) => {
    await open(page, slidesPath)
    await row(page, slideRenamed).locator('img').click()
    await expect(dialog(page).getByRole('tab', { name: 'Image uploading' })).toHaveAttribute('aria-selected', 'true')
    await dialog(page).getByTestId('editor-close').click()

    await row(page, slideRenamed).getByTestId('delete').click()
    await expect(page.getByRole('alertdialog')).toContainText('delete this slide')
    await confirmDialog(page)
    await expect(toast(page).last()).toContainText('Slide was deleted successfully.')
    await expect(row(page, slideRenamed)).toHaveCount(0)
  })

  test('the slides count links to the slides, and the slider can be deleted', async ({ page }) => {
    await open(page, `/sliders/sort/updated_at/desc/search/${sliderRenamed}`)
    await row(page, sliderRenamed).getByTitle('Go to slides').click()
    await expect(page).toHaveURL(/\/slider\/.+\/slides$/)

    await open(page, `/sliders/sort/updated_at/desc/search/${sliderRenamed}`)
    await row(page, sliderRenamed).getByTestId('delete').click()
    await expect(page.getByRole('alertdialog')).toContainText('delete all related slides')
    await confirmDialog(page)
    await expect(toast(page).last()).toContainText('Slider was deleted successfully.')
    await expect(row(page, sliderRenamed)).toHaveCount(0)
  })
})
