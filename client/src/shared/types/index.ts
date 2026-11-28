// Shapes of the Rails API responses after `normalizeIds` (`_id: {$oid}` -> `id`). Fields mirror the Mongoid concerns.

export const LOCALES = ['en', 'ua', 'ru', 'ro'] as const
export type Locale = (typeof LOCALES)[number]

export type Id = string

export interface ImageFile {
  id: Id
  url: string
  extension?: string
  is_cover?: boolean
}

export const CURRENCIES = ['EUR', 'USD', 'UAH'] as const
export type Currency = (typeof CURRENCIES)[number]

export interface Product {
  id: Id
  name: string
  description?: string
  published: boolean
  is_top?: boolean
  size_ids: Id[]
  color_ids: Id[]
  // "from" price, the same in every locale; without a price both are null
  price?: number | null
  currency?: Currency | null
  slug: string
  collection_slug?: string
  images: ImageFile[]
  cover_image?: ImageFile
  created_at?: string
  updated_at?: string
}

export interface Collection {
  id: Id
  name: string
  description?: string
  published: boolean
  has_accessories?: boolean
  slug: string
  products_count: number
  image?: ImageFile
  products?: Product[]
  created_at?: string
  updated_at?: string
}

export interface Size {
  id: Id
  name: string
}

export interface Color {
  id: Id
  name: string
}

export interface SocialNetworking {
  id: Id
  name: string
  url: string
  css_class?: string
  published: boolean
  slug: string
  image?: ImageFile
}

export interface Contact {
  id: Id
  name: string
  published: boolean
  slug: string
  contact_group_slug?: string
}

export interface ContactGroup {
  id: Id
  name: string
  css_class?: string
  published: boolean
  slug: string
  contacts_count: number
  contacts?: Contact[]
}

export interface Slide {
  id: Id
  title: string
  link_text?: string
  link_url?: string
  published: boolean
  slug: string
  slider_slug?: string
  image?: ImageFile
}

export interface Slider {
  id: Id
  name: string
  autoplay?: boolean
  published: boolean
  slug: string
  slides_count: number
  slides?: Slide[]
}

export type SortDirection = 'asc' | 'desc'

export interface SearchRequest {
  search: string
  pagination: { skip: number; take: number }
  sorting: { field: string; direction: SortDirection }
}
