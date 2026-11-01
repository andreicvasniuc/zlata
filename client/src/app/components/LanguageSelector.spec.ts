import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { currentLocale } from '@shared/api'
import { mountWithApp } from '../test/helpers'
import LanguageSelector from './LanguageSelector.vue'

describe('LanguageSelector', () => {
  afterEach(() => document.body.replaceChildren())

  it('shows the name of the current language and offers all four', async () => {
    const { wrapper } = await mountWithApp(LanguageSelector, { locale: 'ua' })

    expect(wrapper.get('.language-toggle').text()).toBe('Українська')
    expect(wrapper.findAll('ul button').map((button) => button.attributes('data-locale'))).toEqual([
      'en',
      'ua',
      'ru',
      'ro',
    ])
    expect(wrapper.get('button[data-locale="ua"]').attributes('aria-current')).toBe('true')
  })

  it('marks Ukrainian text with the language code uk', async () => {
    const { wrapper } = await mountWithApp(LanguageSelector)

    expect(wrapper.get('button[data-locale="ua"]').attributes('lang')).toBe('uk')
  })

  it('opens the list on click and closes it on Escape', async () => {
    const { wrapper } = await mountWithApp(LanguageSelector)
    const toggle = wrapper.get('.language-toggle')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('ul').isVisible()).toBe(false)

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('ul').isVisible()).toBe(true)

    await wrapper.get('.language-selector').trigger('keydown', { key: 'Escape' })
    expect(toggle.attributes('aria-expanded')).toBe('false')
  })

  it('closes the list on a click outside', async () => {
    const { wrapper } = await mountWithApp(LanguageSelector)
    await wrapper.get('.language-toggle').trigger('click')

    document.body.click()
    await flushPromises()

    expect(wrapper.get('.language-toggle').attributes('aria-expanded')).toBe('false')
  })

  it('switches the locale and moves to the same page with the new locale prefix', async () => {
    const { wrapper, router, setLocale } = await mountWithApp(LanguageSelector, { path: '/collections?x=1' })

    await wrapper.get('button[data-locale="ro"]').trigger('click')
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

    await wrapper.get('button[data-locale="en"]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe('/en/collection-queen/diana')
  })

  it('the inline variant lists the languages without a toggle', async () => {
    const { wrapper } = await mountWithApp(LanguageSelector, { props: { inline: true } })

    expect(wrapper.find('.language-toggle').exists()).toBe(false)
    expect(wrapper.findAll('button[data-locale]')).toHaveLength(4)
  })
})
