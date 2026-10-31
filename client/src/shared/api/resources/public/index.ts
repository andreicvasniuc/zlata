import { currentLocale, publicApi } from '../../index'
import type { Collection, Color, ContactGroup, Product, Size, Slider, SocialNetworking } from '../../../types'

// Wrappers for the public `/(:locale)/api/...` endpoints. Reads are cached per locale for the life of the page
// (the old site did the same with `cache: true`); a failed request is not cached.
const cache = new Map<string, Promise<unknown>>()

function cached<T>(path: string): Promise<T> {
  const key = `${currentLocale.value}${path}`
  let request = cache.get(key) as Promise<T> | undefined
  if (!request) {
    request = publicApi.get<T>(path)
    request.catch(() => cache.delete(key))
    cache.set(key, request)
  }
  return request
}

export const clearPublicApiCache = (): void => cache.clear()

export interface ContactMessage {
  name: string
  email: string
  phone?: string
  message: string
}

export const collectionsApi = {
  dresses: () => cached<{ collections: Collection[] }>('/collections/dresses'),
  accessories: () => cached<{ collections: Collection[] }>('/collections/accessories'),
  get: (slug: string) => cached<{ collection: Collection }>(`/collections/${encodeURIComponent(slug)}`),
}

export const productsApi = {
  topList: () => cached<{ products: Product[] }>('/products/top_list'),
}

export const sizesApi = { list: () => cached<{ sizes: Size[] }>('/sizes/list') }
export const colorsApi = { list: () => cached<{ colors: Color[] }>('/colors/list') }
export const slidersApi = { home: () => cached<{ slider?: Slider }>('/sliders/home') }
export const socialNetworkingsApi = {
  list: () => cached<{ social_networkings: SocialNetworking[] }>('/social_networkings/list'),
}
export const contactGroupsApi = { list: () => cached<{ contact_groups: ContactGroup[] }>('/contact_groups/list') }

export const contactsApi = {
  // body is `{ contact: { name, email, phone, message } }` like the old form
  send: (contact: ContactMessage) => publicApi.post<{ contact: ContactMessage }>('/contacts/send_form', { contact }),
}
