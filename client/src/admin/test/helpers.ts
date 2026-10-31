import { mount, type ComponentMountingOptions } from '@vue/test-utils'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import { vi } from 'vitest'
import type { Component } from 'vue'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import en from '@shared/locales/admin/en.json'
import { setLocaleKey } from '../composables/useLocale'

// jsdom has no matchMedia (PrimeVue's Select listens to it)
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  addEventListener: () => undefined,
  removeEventListener: () => undefined,
  addListener: () => undefined,
  removeListener: () => undefined,
  dispatchEvent: () => false,
  onchange: null,
})) as typeof window.matchMedia

// ... nor ResizeObserver (PrimeVue's TabList)
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

export const messages = en as Record<string, string>

// Mounts a component with everything the admin app installs (PrimeVue unstyled, i18n in English, a router,
// toasts and confirmations). Teleported parts (dialogs, toasts) end up in `document.body`.
export function mountWithPlugins(component: Component, options: ComponentMountingOptions<Component> = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null } }],
  })
  const i18n = createI18n({ legacy: false, locale: 'en', fallbackLocale: 'en', messages: { en: messages } })

  const pinia = createPinia()
  const wrapper = mount(component, {
    attachTo: document.body,
    ...options,
    global: {
      plugins: [pinia, router, i18n, [PrimeVue, { unstyled: true }], ToastService, ConfirmationService],
      provide: { [setLocaleKey as symbol]: vi.fn() },
      ...options.global,
    },
  })
  return { wrapper, router, pinia }
}

export const flush = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await new Promise((resolve) => setTimeout(resolve, 0))
}

export const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)
export const allByTestId = (id: string) => [...document.body.querySelectorAll<HTMLElement>(`[data-testid="${id}"]`)]

export function setValue(element: HTMLElement | null, value: string) {
  const input = element as HTMLInputElement
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
}
