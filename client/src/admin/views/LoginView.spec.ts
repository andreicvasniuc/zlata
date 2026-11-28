import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchError, ofetch } from 'ofetch'
import { useSession } from '@shared/auth/session'
import LoginView from './LoginView.vue'
import { byTestId, flush, mountWithPlugins, setValue } from '../test/helpers'

vi.mock('ofetch', async (importOriginal) => ({ ...(await importOriginal<typeof import('ofetch')>()), ofetch: vi.fn() }))

const toasts = vi.hoisted(() => ({ add: vi.fn() }))
vi.mock('primevue/usetoast', () => ({ useToast: () => toasts }))

const Page = LoginView
const shownToasts = () => toasts.add.mock.calls.map(([toast]) => (toast as { summary: string }).summary)

function failing(status: number) {
  const error = new FetchError(String(status))
  error.status = status
  return error
}

async function submit(email: string, password: string) {
  setValue(document.getElementById('login-email'), email)
  setValue(document.getElementById('login-password'), password)
  byTestId('login-form')!.dispatchEvent(new Event('submit', { cancelable: true }))
  await flush()
}

beforeEach(() => {
  vi.mocked(ofetch).mockReset()
  toasts.add.mockReset()
})

afterEach(() => {
  document.body.innerHTML = ''
  sessionStorage.clear()
})

describe('LoginView', () => {
  it('validates the form before calling the API', async () => {
    mountWithPlugins(Page)

    await submit('', '')

    expect(ofetch).not.toHaveBeenCalled()
    expect(document.getElementById('login-email')?.getAttribute('aria-invalid')).toBe('true')
    expect(document.getElementById('login-password')?.getAttribute('aria-invalid')).toBe('true')
  })

  it('rejects something that is not an e-mail address', async () => {
    mountWithPlugins(Page)

    await submit('not-an-email', 'secret')

    expect(ofetch).not.toHaveBeenCalled()
    expect(document.getElementById('login-email')?.getAttribute('aria-invalid')).toBe('true')
  })

  it('stores the token and goes where the user wanted to go (201)', async () => {
    vi.mocked(ofetch).mockResolvedValue({ jwt: 'token-123' })
    const { router, pinia } = mountWithPlugins(Page)
    useSession(pinia).redirectTo = '/collections/sort/name/asc/search'

    await submit('admin@example.test', 'secret')

    expect(ofetch).toHaveBeenCalledWith('/user_token', {
      method: 'POST',
      body: { auth: { email: 'admin@example.test', password: 'secret' } },
    })
    expect(sessionStorage.getItem('auth_token')).toBe('token-123')
    expect(router.currentRoute.value.fullPath).toBe('/collections/sort/name/asc/search')
    expect(useSession(pinia).redirectTo).toBeNull()
  })

  it('goes to the start page without a remembered destination', async () => {
    vi.mocked(ofetch).mockResolvedValue({ jwt: 'token-123' })
    const { router } = mountWithPlugins(Page)

    await submit('admin@example.test', 'secret')

    expect(router.currentRoute.value.fullPath).toBe('/')
  })

  it('shows "Incorrect email or password" for a 404 and stores nothing', async () => {
    vi.mocked(ofetch).mockImplementation(() => Promise.reject(failing(404)))
    mountWithPlugins(Page)

    await submit('admin@example.test', 'wrong')

    expect(shownToasts()).toEqual(['Incorrect email or password'])
    expect(sessionStorage.getItem('auth_token')).toBeNull()
  })

  it('shows a generic error for any other failure', async () => {
    vi.mocked(ofetch).mockImplementation(() => Promise.reject(failing(500)))
    mountWithPlugins(Page)

    await submit('admin@example.test', 'secret')

    expect(shownToasts()).toEqual(['Something went wrong. Please try again.'])
  })

  it('deletes the credential cookies set by the old admin', async () => {
    document.cookie = 'email=someone@example.test; path=/'
    document.cookie = 'password=plain-text; path=/'

    mountWithPlugins(Page)
    await flush()

    expect(document.cookie).not.toContain('email=')
    expect(document.cookie).not.toContain('password=')
  })

  it('never writes credentials to cookies or storage', async () => {
    vi.mocked(ofetch).mockResolvedValue({ jwt: 'token-123' })
    mountWithPlugins(Page)

    await submit('admin@example.test', 'secret-password')

    expect(document.cookie).toBe('')
    expect(JSON.stringify({ ...localStorage, ...sessionStorage })).not.toContain('secret-password')
  })
})
