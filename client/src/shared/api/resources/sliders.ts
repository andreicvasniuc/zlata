import type { SearchRequest, Slide, Slider } from '../../types'
import { adminApi } from '../index'

export interface SliderInput {
  name: string
  autoplay?: boolean
  published?: boolean
}

export interface SlideInput {
  title: string
  link_text?: string
  link_url?: string
  published?: boolean
}

export type SliderName = Pick<Slider, 'id' | 'name' | 'slug'>

const url = (slug: string) => `/sliders/${encodeURIComponent(slug)}`
const slideUrl = (sliderSlug: string, slug: string) => `${url(sliderSlug)}/slides/${encodeURIComponent(slug)}`

export const slidersApi = {
  search: (request: SearchRequest) =>
    adminApi.post<{ sliders: Slider[]; totalCount: number }>('/sliders/search', request),
  list: () => adminApi.get<{ sliders: SliderName[] }>('/sliders/list'),
  get: (slug: string) => adminApi.get<Slider>(url(slug)),
  create: (slider: SliderInput) => adminApi.post<Slider>('/sliders', { slider }),
  update: (slug: string, slider: SliderInput) => adminApi.put<Slider>(url(slug), { slider }),
  remove: (slug: string) => adminApi.delete<Slider>(url(slug)),
}

export const slidesApi = {
  get: (sliderSlug: string, slug: string) => adminApi.get<Slide>(slideUrl(sliderSlug, slug)),
  create: (sliderSlug: string, slide: SlideInput) => adminApi.post<Slide>(`${url(sliderSlug)}/slides`, { slide }),
  update: (sliderSlug: string, slug: string, slide: SlideInput) =>
    adminApi.put<Slide>(slideUrl(sliderSlug, slug), { slide }),
  remove: (sliderSlug: string, slug: string) => adminApi.delete<Slide>(slideUrl(sliderSlug, slug)),
  uploadImage: (sliderSlug: string, slug: string, imageUrl: string) =>
    adminApi.post<Slide>(`${slideUrl(sliderSlug, slug)}/upload_image`, { image: { url: imageUrl } }),
}
