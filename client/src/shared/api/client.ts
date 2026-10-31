import { ofetch, FetchError, type FetchOptions } from 'ofetch'
import type { Locale } from '../types'
import { normalizeIds } from './normalize'

export interface ApiContext {
  getLocale: () => Locale
  getToken: () => string | null
  onUnauthorized: () => void
}

type Body = FetchOptions['body']
type Scope = 'api' | 'admin'
type Fetcher = typeof ofetch

export interface ApiClient {
  get<T>(path: string, query?: Record<string, string>): Promise<T>
  post<T>(path: string, body?: Body): Promise<T>
  put<T>(path: string, body?: Body): Promise<T>
  patch<T>(path: string, body?: Body): Promise<T>
  delete<T>(path: string): Promise<T>
}

// Paths are relative to `/(:locale)/api` (public) or `/(:locale)/admin` (admin).
export function createApi(scope: Scope, context: ApiContext, fetcher: Fetcher = ofetch): ApiClient {
  const request = async <T>(method: string, path: string, options: FetchOptions<'json'> = {}): Promise<T> => {
    const token = context.getToken()
    try {
      const data = await fetcher<unknown>(`/${context.getLocale()}/${scope}${path}`, {
        ...options,
        method: method as FetchOptions<'json'>['method'],
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        retry: false,
      })
      return normalizeIds<T>(data)
    } catch (error) {
      if (error instanceof FetchError && error.status === 401) context.onUnauthorized()
      throw error
    }
  }

  return {
    get: (path, query) => request('GET', path, { query }),
    post: (path, body) => request('POST', path, { body }),
    put: (path, body) => request('PUT', path, { body }),
    patch: (path, body) => request('PATCH', path, { body }),
    delete: (path) => request('DELETE', path),
  }
}

export { FetchError }
