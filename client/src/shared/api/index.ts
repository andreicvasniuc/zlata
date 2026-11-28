import { ref } from 'vue'
import { getToken } from '../auth/token'
import { DEFAULT_LOCALE } from '../i18n/locale'
import type { Locale } from '../types'
import { createApi } from './client'

// The locale every request is made in; the i18n setup of each app keeps it in sync (see `useLocale`).
export const currentLocale = ref<Locale>(DEFAULT_LOCALE)

let unauthorizedHandler: () => void = () => {}

// Any 401 clears the token (done by the handler) and sends the admin to the login page.
export const onUnauthorized = (handler: () => void): void => {
  unauthorizedHandler = handler
}

const context = {
  getLocale: () => currentLocale.value,
  getToken,
  onUnauthorized: () => unauthorizedHandler(),
}

export const publicApi = createApi('api', context)
export const adminApi = createApi('admin', context)

export { FetchError } from './client'
export { normalizeIds } from './normalize'
