import type { SearchRequest, SocialNetworking } from '../../types'
import { adminApi } from '../index'

export interface SocialNetworkingInput {
  name: string
  url: string
  css_class?: string
  published?: boolean
}

const url = (slug: string) => `/social_networkings/${encodeURIComponent(slug)}`

export const socialNetworkingsApi = {
  search: (request: SearchRequest) =>
    adminApi.post<{ socialNetworkings: SocialNetworking[]; totalCount: number }>('/social_networkings/search', request),
  get: (slug: string) => adminApi.get<SocialNetworking>(url(slug)),
  create: (social_networking: SocialNetworkingInput) =>
    adminApi.post<SocialNetworking>('/social_networkings', { social_networking }),
  update: (slug: string, social_networking: SocialNetworkingInput) =>
    adminApi.put<SocialNetworking>(url(slug), { social_networking }),
  remove: (slug: string) => adminApi.delete<SocialNetworking>(url(slug)),
}
