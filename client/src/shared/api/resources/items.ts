import type { Color, Id, Size } from '../../types'
import { adminApi } from '../index'

// Sizes and colors are plain `{ id, name }` lists, addressed by id.
function itemsApi<T extends { id: Id; name: string }>(resource: 'sizes' | 'colors', key: 'size' | 'color') {
  return {
    list: () => adminApi.get<Record<string, T[]>>(`/${resource}/list`).then((response) => response[resource] ?? []),
    create: (name: string) => adminApi.post<T>(`/${resource}`, { [key]: { name } }),
    update: (id: Id, name: string) => adminApi.put<T>(`/${resource}/${id}`, { [key]: { name } }),
    remove: (id: Id) => adminApi.delete<T>(`/${resource}/${id}`),
  }
}

export type ItemsApi = ReturnType<typeof itemsApi<Size | Color>>

export const sizesApi = itemsApi<Size>('sizes', 'size')
export const colorsApi = itemsApi<Color>('colors', 'color')
