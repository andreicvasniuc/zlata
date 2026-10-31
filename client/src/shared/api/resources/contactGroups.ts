import type { Contact, ContactGroup, SearchRequest } from '../../types'
import { adminApi } from '../index'

export interface ContactGroupInput {
  name: string
  css_class?: string
  published?: boolean
}

export interface ContactInput {
  name: string
  published?: boolean
}

export type ContactGroupName = Pick<ContactGroup, 'id' | 'name' | 'slug'>

const url = (slug: string) => `/contact_groups/${encodeURIComponent(slug)}`
const contactUrl = (groupSlug: string, slug: string) => `${url(groupSlug)}/contacts/${encodeURIComponent(slug)}`

export const contactGroupsApi = {
  search: (request: SearchRequest) =>
    adminApi.post<{ contactGroups: ContactGroup[]; totalCount: number }>('/contact_groups/search', request),
  list: () => adminApi.get<{ contactGroups: ContactGroupName[] }>('/contact_groups/list'),
  get: (slug: string) => adminApi.get<ContactGroup>(url(slug)),
  create: (contact_group: ContactGroupInput) => adminApi.post<ContactGroup>('/contact_groups', { contact_group }),
  update: (slug: string, contact_group: ContactGroupInput) => adminApi.put<ContactGroup>(url(slug), { contact_group }),
  remove: (slug: string) => adminApi.delete<ContactGroup>(url(slug)),
}

export const contactsApi = {
  get: (groupSlug: string, slug: string) => adminApi.get<Contact>(contactUrl(groupSlug, slug)),
  create: (groupSlug: string, contact: ContactInput) =>
    adminApi.post<Contact>(`${url(groupSlug)}/contacts`, { contact }),
  update: (groupSlug: string, slug: string, contact: ContactInput) =>
    adminApi.put<Contact>(contactUrl(groupSlug, slug), { contact }),
  remove: (groupSlug: string, slug: string) => adminApi.delete<Contact>(contactUrl(groupSlug, slug)),
}
