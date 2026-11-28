import { expect, type APIRequestContext, type Locator, type Page } from '@playwright/test'

// The admin specs run against the Vite dev server (proxying to Rails with the local data copy) and need a token:
//   E2E_ADMIN_TOKEN=$(docker compose exec -T web bin/rails runner 'puts AuthToken.issue(User.first)')
// Everything they create is named `e2e-...` and removed again.

export const BASE = '/admin'
export const token = process.env.E2E_ADMIN_TOKEN?.trim()
export const PREFIX = 'e2e-'

export const uniqueName = (label: string) => `${PREFIX}${label}-${Date.now().toString(36)}`

export async function signInWithToken(page: Page) {
  await page.addInitScript((value) => {
    sessionStorage.setItem('auth_token', value ?? '')
    // texts are asserted in English unless a test switches the language
    if (!localStorage.getItem('zlata.locale')) localStorage.setItem('zlata.locale', 'en')
  }, token)
}

export async function open(page: Page, path: string) {
  await page.goto(`${BASE}${path}`)
}

export const row = (page: Page, text: string): Locator => page.getByRole('row', { name: new RegExp(text) })
export const dialog = (page: Page): Locator => page.getByRole('dialog')
export const toast = (page: Page): Locator => page.locator('.p-toast-message')

// finds a row through the search box (the grids load 10 rows at a time)
export async function search(page: Page, text: string) {
  await page.getByTestId('search-input').fill(text)
  await page.getByTestId('search-input').press('Enter')
  await expect(page).toHaveURL(new RegExp(`/search/${encodeURIComponent(text)}$`))
}

export async function confirmDialog(page: Page) {
  await page.getByRole('alertdialog').getByRole('button', { name: 'Yes' }).click()
}

const headers = () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })

// removes whatever an earlier (failed) run left behind
export async function cleanup(request: APIRequestContext) {
  const isMine = (item: { name?: string; title?: string }) => (item.name ?? item.title ?? '').startsWith(PREFIX)
  const del = (path: string) => request.delete(`/en/admin${path}`, { headers: headers() })
  const get = async <T>(path: string) =>
    (await request.get(`/en/admin${path}`, { headers: headers() })).json() as Promise<T>

  type Named = { name: string; slug: string; _id: { $oid: string } }
  const { collections } = await get<{ collections: Named[] }>('/collections/list')
  for (const item of collections.filter(isMine)) await del(`/collections/${item.slug}`)
  const { sliders } = await get<{ sliders: Named[] }>('/sliders/list')
  for (const item of sliders.filter(isMine)) await del(`/sliders/${item.slug}`)
  const { contactGroups } = await get<{ contactGroups: Named[] }>('/contact_groups/list')
  for (const item of contactGroups.filter(isMine)) await del(`/contact_groups/${item.slug}`)
  for (const resource of ['sizes', 'colors'] as const) {
    const items = (await get<Record<string, Named[]>>(`/${resource}/list`))[resource] ?? []
    for (const item of items.filter(isMine)) await del(`/${resource}/${item._id.$oid}`)
  }
  const found = await request.post('/en/admin/social_networkings/search', {
    headers: headers(),
    data: { search: PREFIX, pagination: { skip: 0, take: 100 }, sorting: { field: 'name', direction: 'asc' } },
  })
  const { socialNetworkings } = (await found.json()) as { socialNetworkings: Named[] }
  for (const item of socialNetworkings.filter(isMine)) await del(`/social_networkings/${item.slug}`)
}
