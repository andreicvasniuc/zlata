import { defineStore } from 'pinia'
import { ofetch, FetchError } from 'ofetch'
import { clearToken, getToken, setToken } from './token'

export type LoginResult = 'ok' | 'invalid-credentials' | 'error'

export const useSession = defineStore('session', {
  state: () => ({
    token: getToken(),
    // where to go after a successful login (set when a 401 or a guard sends the user to the login page)
    redirectTo: null as string | null,
  }),
  getters: {
    isLoggedIn: (state) => state.token !== null,
  },
  actions: {
    async login(email: string, password: string): Promise<LoginResult> {
      try {
        // 201 { jwt }; 404 means unknown e-mail or wrong password
        const { jwt } = await ofetch<{ jwt: string }>('/user_token', {
          method: 'POST',
          body: { auth: { email, password } },
        })
        setToken(jwt)
        this.token = jwt
        return 'ok'
      } catch (error) {
        return error instanceof FetchError && error.status === 404 ? 'invalid-credentials' : 'error'
      }
    },
    logout() {
      clearToken()
      this.token = null
    },
  },
})
