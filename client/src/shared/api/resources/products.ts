import type { Currency, Id, Product } from '../../types'
import { adminApi } from '../index'

export interface ProductInput {
  name: string
  description?: string
  published?: boolean
  is_top?: boolean
  size_ids?: Id[]
  color_ids?: Id[]
  price?: number | null
  currency?: Currency | null
}

const base = (collectionSlug: string) => `/collections/${encodeURIComponent(collectionSlug)}/products`
const url = (collectionSlug: string, slug: string) => `${base(collectionSlug)}/${encodeURIComponent(slug)}`

export const productsApi = {
  get: (collectionSlug: string, slug: string) => adminApi.get<Product>(url(collectionSlug, slug)),
  create: (collectionSlug: string, product: ProductInput) => adminApi.post<Product>(base(collectionSlug), { product }),
  update: (collectionSlug: string, slug: string, product: ProductInput) =>
    adminApi.put<Product>(url(collectionSlug, slug), { product }),
  remove: (collectionSlug: string, slug: string) => adminApi.delete<Product>(url(collectionSlug, slug)),
}

export const imagesApi = {
  upload: (collectionSlug: string, productSlug: string, imageUrl: string) =>
    adminApi.post<Product>(`${url(collectionSlug, productSlug)}/images/upload`, { image: { url: imageUrl } }),
  makeCover: (collectionSlug: string, productSlug: string, imageId: Id) =>
    adminApi.patch<Product>(`${url(collectionSlug, productSlug)}/images/${imageId}/make_cover`),
  remove: (collectionSlug: string, productSlug: string, imageId: Id) =>
    adminApi.delete<Product>(`${url(collectionSlug, productSlug)}/images/${imageId}`),
}
