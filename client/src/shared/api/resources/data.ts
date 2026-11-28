import { adminApi } from '../index'

export const dataApi = {
  export: () => adminApi.post<{ data: unknown }>('/data/export'),
}
