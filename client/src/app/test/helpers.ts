import { vi } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { Component } from 'vue'
import { currentLocale } from '@shared/api'
import en from '@shared/locales/app/en.json'
import ua from '@shared/locales/app/ua.json'
import type { Locale } from '@shared/types'
import { setLocaleKey } from '../locale'
import { buildRoutes } from '../router'

const Stub = { template: '<div />' }
const stub = () => Promise.resolve(Stub)

// The real route table (src/app/router.ts) with stub pages.
export const testRoutes = buildRoutes({
  layout: stub,
  home: stub,
  collectionList: stub,
  contacts: stub,
  about: stub,
  collection: stub,
  product: stub,
})

export interface MountOptions {
  path?: string
  locale?: Locale
  props?: Record<string, unknown>
  slots?: Record<string, string>
}

// Mounts a component with Pinia, vue-i18n (English and Ukrainian messages), a router and `setLocale`.
export async function mountWithApp(component: Component, options: MountOptions = {}) {
  const { path = '/', locale = 'en', props, slots } = options
  const pinia = createPinia()
  setActivePinia(pinia)
  currentLocale.value = locale

  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages: { en, ua } as Record<string, typeof en>,
    missingWarn: false,
    fallbackWarn: false,
  })
  const router = createRouter({ history: createMemoryHistory(), routes: testRoutes })
  await router.push(path)
  await router.isReady()

  const setLocale = vi.fn(async (target: Locale) => {
    i18n.global.locale.value = target
    currentLocale.value = target
  })

  const wrapper: VueWrapper = mount(component, {
    props,
    slots,
    attachTo: document.body,
    global: { plugins: [pinia, i18n, router], provide: { [setLocaleKey as symbol]: setLocale } },
  })
  await flushPromises()
  return { wrapper, router, i18n, setLocale, pinia }
}
