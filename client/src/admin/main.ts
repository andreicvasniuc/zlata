import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import '@shared/styles/theme.css'
import '@shared/styles/fonts'
import { onUnauthorized } from '@shared/api'
import { useSession } from '@shared/auth/session'
import { createAppI18n } from '@shared/i18n'
import { resolveLocale } from '@shared/i18n/locale'
import App from './App.vue'
import { setLocaleKey } from './composables/useLocale'
import { createAdminRouter } from './router'
import { AdminPreset } from './theme'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  const router = createAdminRouter()
  const { i18n, setLocale } = createAppI18n('admin')

  app.use(pinia)
  app.use(router)
  app.use(i18n)
  app.use(PrimeVue, {
    theme: {
      preset: AdminPreset,
      options: { darkModeSelector: false, cssLayer: { name: 'primevue', order: 'theme, base, primevue' } },
    },
  })
  app.use(ToastService)
  app.use(ConfirmationService)
  app.provide(setLocaleKey, setLocale)

  // any 401: forget the token and go to the login page, remembering where the user was
  onUnauthorized(() => {
    const session = useSession()
    session.logout()
    if (router.currentRoute.value.name !== 'login') session.redirectTo = router.currentRoute.value.fullPath
    void router.push({ name: 'login' })
  })

  await setLocale(resolveLocale())
  await router.isReady()
  app.mount('#app')
}

void bootstrap()
