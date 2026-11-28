import { expect, test } from '@playwright/test'
import { cleanup, confirmDialog, dialog, open, row, search, signInWithToken, toast, token, uniqueName } from './support'

test.skip(!token, 'set E2E_ADMIN_TOKEN (see support.ts)')

test.describe.serial('contact groups and contacts', () => {
  const group = uniqueName('group')
  const groupRenamed = `${group}-renamed`
  const contact = uniqueName('contact')
  const contactRenamed = `${contact}-renamed`
  let contactsPath = ''

  test.beforeAll(({ request }) => cleanup(request))
  test.afterAll(({ request }) => cleanup(request))
  test.beforeEach(({ page }) => signInWithToken(page))

  test('create a contact group with an icon', async ({ page }) => {
    await open(page, '/contact-groups')
    await page.getByTestId('add').click()
    await expect(dialog(page)).toContainText('Create Contact group')
    await dialog(page).getByLabel('Name').fill(group)
    await dialog(page).locator('#cg-css-class').click()
    await page.getByRole('option', { name: 'Viber' }).click()
    await dialog(page).getByTestId('editor-save').click()

    await expect(toast(page)).toContainText('Contact group was created successfully.')
    await expect(dialog(page)).toBeHidden()
    await search(page, group)
    await expect(row(page, group)).toBeVisible()
  })

  test('edit the group and toggle publishing', async ({ page }) => {
    await open(page, `/contact-groups/sort/updated_at/desc/search/${group}`)
    await row(page, group).getByTestId('edit').click()
    await expect(dialog(page)).toContainText('Viber')
    await dialog(page).getByLabel('Name').fill(groupRenamed)
    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page).last()).toContainText('Contact group was updated successfully.')

    await search(page, groupRenamed)
    const toggle = row(page, groupRenamed).getByTestId('published-toggle')
    await toggle.click()
    await expect(toast(page).last()).toContainText('Contact group was published successfully.')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  test('the contacts page without a group lets you pick one', async ({ page }) => {
    await open(page, '/contacts')
    await page.getByTestId('parent-select').click()
    await page.getByRole('option', { name: groupRenamed }).click()
    await expect(page).toHaveURL(/\/contact-group\/.+\/contacts$/)
    contactsPath = new URL(page.url()).pathname.replace('/admin', '')
    await expect(page.getByTestId('parent-heading')).toContainText(groupRenamed)
  })

  test('create, edit, publish and delete a contact', async ({ page }) => {
    await open(page, contactsPath)
    await page.getByTestId('add').click()
    await expect(dialog(page)).toContainText('Create Contact')
    await dialog(page).getByLabel('Name').fill(contact)
    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page)).toContainText('Contact was created successfully.')
    await expect(row(page, contact)).toBeVisible()

    await row(page, contact).getByTestId('edit').click()
    await dialog(page).getByLabel('Name').fill(contactRenamed)
    await dialog(page).getByTestId('editor-save').click()
    await expect(toast(page).last()).toContainText('Contact was updated successfully.')
    await expect(row(page, contactRenamed)).toBeVisible()

    const toggle = row(page, contactRenamed).getByTestId('published-toggle')
    await toggle.click()
    await expect(toast(page).last()).toContainText('Contact was published successfully.')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await row(page, contactRenamed).getByTestId('delete').click()
    await expect(page.getByRole('alertdialog')).toContainText('delete this contact')
    await confirmDialog(page)
    await expect(toast(page).last()).toContainText('Contact was deleted successfully.')
    await expect(row(page, contactRenamed)).toHaveCount(0)
  })

  test('the contacts count links to the contacts, and the group can be deleted', async ({ page }) => {
    await open(page, `/contact-groups/sort/updated_at/desc/search/${groupRenamed}`)
    await row(page, groupRenamed).getByTitle('Go to contacts').click()
    await expect(page).toHaveURL(/\/contact-group\/.+\/contacts$/)

    await open(page, `/contact-groups/sort/updated_at/desc/search/${groupRenamed}`)
    await row(page, groupRenamed).getByTestId('delete').click()
    await expect(page.getByRole('alertdialog')).toContainText('delete all related contacts')
    await confirmDialog(page)
    await expect(toast(page).last()).toContainText('Contact group was deleted successfully.')
    await expect(row(page, groupRenamed)).toHaveCount(0)
  })
})
