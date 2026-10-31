import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@shared/styles/theme.css'
import '@shared/styles/fonts'
import './styles/site.css'
import { createAppI18n } from '@shared/i18n'
import { resolveLocale } from '@shared/i18n/locale'
import App from './App.vue'
import { setLocaleKey } from './locale'
import { createAppRouter } from './router'

async function bootstrap() {
  const app = createApp(App)
  const router = createAppRouter()
  const { i18n, setLocale } = createAppI18n('app')

  app.use(createPinia())
  app.use(router)
  app.use(i18n)
  app.provide(setLocaleKey, setLocale)

  await router.isReady()
  // the URL locale wins, then the saved preference, then the default
  await setLocale(resolveLocale(router.currentRoute.value.params.locale as string | undefined))
  app.mount('#app')
}

void bootstrap()
