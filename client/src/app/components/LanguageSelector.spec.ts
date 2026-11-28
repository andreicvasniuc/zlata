import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { currentLocale } from '@shared/api'
import { mountWithApp } from '../test/helpers'
import LanguageSelector from './LanguageSelector.vue'

describe('LanguageSelector', () => {
  afterEach(() => document.body.replaceChildren())

  it('shows all four languages as text codes, no flags', async () => {
    const { wrapper } = await mountWithApp(LanguageSelector)

    expect(wrapper.findAll('a').map((link) => link.text())).toEqual(['EN', 'UA', 'RO', 'RU'])
    expect(wrapper.findAll('a').map((link) => link.attributes('data-locale'))).toEqual(['en', 'ua', 'ro', 'ru'])
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('names every language in full for screen readers and marks the current one', async () => {
    const { wrapper } = await mountWithApp(LanguageSelector, { locale: 'ua' })

    expect(wrapper.get('a[data-locale="ua"]').attributes('aria-label')).toBe('Українська')
    expect(wrapper.get('a[data-locale="ua"]').attributes('aria-current')).toBe('true')
    expect(wrapper.get('a[data-locale="ua"]').classes()).toContain('active')
    expect(wrapper.get('a[data-locale="en"]').attributes('aria-current')).toBeUndefined()
  })

  it('switches the locale and moves to the same page with the new locale prefix', async () => {
    const { wrapper, router, setLocale } = await mountWithApp(LanguageSelector, { path: '/collections?x=1' })

    await wrapper.get('a[data-locale="ro"]').trigger('click')
    await flushPromises()

    expect(setLocale).toHaveBeenCalledWith('ro')
    expect(currentLocale.value).toBe('ro')
    expect(router.currentRoute.value.fullPath).toBe('/ro/collections?x=1')
  })

  it('keeps the collection and product when the language changes', async () => {
    const { wrapper, router } = await mountWithApp(LanguageSelector, {
      path: '/ua/collection-queen/diana',
      locale: 'ua',
    })

    await wrapper.get('a[data-locale="en"]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe('/en/collection-queen/diana')
  })
})
