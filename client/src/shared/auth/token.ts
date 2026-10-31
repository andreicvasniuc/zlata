const TOKEN_KEY = 'auth_token'

export const getToken = (): string | null => sessionStorage.getItem(TOKEN_KEY)
export const setToken = (token: string): void => sessionStorage.setItem(TOKEN_KEY, token)
export const clearToken = (): void => sessionStorage.removeItem(TOKEN_KEY)

// Older versions of the admin login stored the e-mail and the plain-text password in cookies.
export function deleteLegacyCredentialCookies(): void {
  for (const name of ['email', 'password']) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  }
}
