import type { Collection, SearchRequest } from '../../types'
import { adminApi } from '../index'

export interface CollectionInput {
  name: string
  description?: string
  published?: boolean
  has_accessories?: boolean
}

export type CollectionName = Pick<Collection, 'id' | 'name' | 'slug'>

const url = (slug: string) => `/collections/${encodeURIComponent(slug)}`

// Collections, products and their images are addressed by slug (images by id).
export const collectionsApi = {
  search: (request: SearchRequest) =>
    adminApi.post<{ collections: Collection[]; totalCount: number }>('/collections/search', request),
  list: () => adminApi.get<{ collections: CollectionName[] }>('/collections/list'),
  get: (slug: string) => adminApi.get<Collection>(url(slug)),
  create: (collection: CollectionInput) => adminApi.post<Collection>('/collections', { collection }),
  update: (slug: string, collection: CollectionInput) => adminApi.put<Collection>(url(slug), { collection }),
  remove: (slug: string) => adminApi.delete<Collection>(url(slug)),
  uploadImage: (slug: string, imageUrl: string) =>
    adminApi.post<Collection>(`${url(slug)}/upload_image`, { image: { url: imageUrl } }),
}
