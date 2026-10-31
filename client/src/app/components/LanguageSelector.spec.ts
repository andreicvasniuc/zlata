import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { currentLocale } from '@shared/api'
import { mountWithApp } from '../test/helpers'
import LanguageSelector from './LanguageSelector.vue'

describe('LanguageSelector', () => {
  afterEach(() => document.body.replaceChildren())

  it('shows the flag of the current language and offers all four', async () => {
    const { wrapper } = await mountWithApp(LanguageSelector, { locale: 'ua' })

    expect(wrapper.get('a.fh5co-sub-ddown img').attributes('alt')).toBe('selected language')
    expect(wrapper.findAll('ul a').map((link) => link.attributes('data-locale'))).toEqual(['ua', 'ru', 'ro', 'en'])
  })

  it('switches the locale and moves to the same page with the new locale prefix', async () => {
    const { wrapper, router, setLocale } = await mountWithApp(LanguageSelector, { path: '/collections?x=1' })

    await wrapper.get('a[data-locale="ro"]').trigger('click')
    await flushPromises()

    expect(setLocale).toHaveBeenCalledWith('ro')
    expect(currentLocale.value).toBe('ro')
    expect(router.currentRoute.value.fullPath).toBe('/ro/collections?x=1')
  })

  it('replaces an existing prefix, also on a product page', async () => {
    const { wrapper, router } = await mountWithApp(LanguageSelector, { path: '/ua/collection-queen/diana' })

    await wrapper.get('a[data-locale="en"]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe('/en/collection-queen/diana')
  })

  it('toggles the list on click for touch screens', async () => {
    const { wrapper } = await mountWithApp(LanguageSelector)
    expect(wrapper.get('ul').classes()).not.toContain('open')

    await wrapper.get('a.fh5co-sub-ddown').trigger('click')
    expect(wrapper.get('ul').classes()).toContain('open')
  })
})
