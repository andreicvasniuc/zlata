import { describe, expect, it, vi } from 'vitest'
import { FetchError } from 'ofetch'
import { createApi } from './client'

const context = (overrides = {}) => ({
  getLocale: () => 'ua' as const,
  getToken: () => 'token-1' as string | null,
  onUnauthorized: vi.fn(),
  ...overrides,
})

const failingWith = (status: number) => {
  const error = new FetchError(String(status))
  error.status = status
  return error
}

describe('createApi', () => {
  it('prefixes the locale and scope, sends the bearer token and normalizes ids', async () => {
    const fetcher = vi.fn().mockResolvedValue({ _id: { $oid: 'c1' } })
    const api = createApi('admin', context(), fetcher as never)

    const result = await api.get('/collections/list')

    expect(result).toEqual({ id: 'c1' })
    expect(fetcher).toHaveBeenCalledWith(
      '/ua/admin/collections/list',
      expect.objectContaining({ method: 'GET', headers: { Authorization: 'Bearer token-1' } }),
    )
  })

  it('sends no Authorization header without a token', async () => {
    const fetcher = vi.fn().mockResolvedValue({})
    const api = createApi('api', context({ getToken: () => null }), fetcher as never)

    await api.get('/sliders/home')

    expect(fetcher).toHaveBeenCalledWith('/ua/api/sliders/home', expect.objectContaining({ headers: undefined }))
  })

  it('calls onUnauthorized on a 401 and rethrows', async () => {
    const error = failingWith(401)
    const ctx = context()
    const api = createApi('admin', ctx, vi.fn().mockRejectedValue(error) as never)

    await expect(api.post('/collections/search', {})).rejects.toBe(error)
    expect(ctx.onUnauthorized).toHaveBeenCalledOnce()
  })

  it('does not treat other errors as unauthorized', async () => {
    const error = failingWith(422)
    const ctx = context()
    const api = createApi('admin', ctx, vi.fn().mockRejectedValue(error) as never)

    await expect(api.put('/colors/1', {})).rejects.toBe(error)
    expect(ctx.onUnauthorized).not.toHaveBeenCalled()
  })
})
