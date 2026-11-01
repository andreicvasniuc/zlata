import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithApp } from '../test/helpers'
import { useLayout } from '../stores/layout'
import AppHeader from './AppHeader.vue'
import MobileMenu from './MobileMenu.vue'

const api = vi.hoisted(() => ({ collectionsApi: { dresses: vi.fn() } }))
vi.mock('@shared/api/resources/public', () => api)

beforeEach(() => {
  api.collectionsApi.dresses.mockResolvedValue({ collections: [] })
})
afterEach(() => document.body.replaceChildren())

describe('AppHeader', () => {
  it('has the logo link, the main menu and the language selector', async () => {
    const { wrapper } = await mountWithApp(AppHeader)

    expect(wrapper.get('.site-logo').attributes('href')).toBe('/')
    expect(wrapper.get('.site-logo img').attributes('alt')).toBe('Zlata wedding fashion')
    expect(wrapper.findAll('.main-menu a').map((link) => link.text())).toEqual([
      'Collections',
      'Accessories',
      'About',
      'Contacts',
    ])
    expect(wrapper.find('.site-header-desktop .language-selector').exists()).toBe(true)
  })

  it('offers a skip link to the main content', async () => {
    const { wrapper } = await mountWithApp(AppHeader)

    expect(wrapper.get('.skip-link').attributes('href')).toBe('#main')
  })

  it('adds Evening dresses once that collection is published', async () => {
    api.collectionsApi.dresses.mockResolvedValue({
      collections: [{ id: 'e', name: 'Evening', slug: 'evening-dresses' }],
    })
    const { wrapper } = await mountWithApp(AppHeader)

    const links = wrapper.findAll('.main-menu a')
    expect(links.map((link) => link.text())).toEqual([
      'Collections',
      'Evening dresses',
      'Accessories',
      'About',
      'Contacts',
    ])
    expect(links[1]?.attributes('href')).toBe('/evening-dresses')
  })

  it('still renders the menu when the collections cannot be loaded', async () => {
    api.collectionsApi.dresses.mockRejectedValue(new Error('500'))
    const { wrapper } = await mountWithApp(AppHeader)

    expect(wrapper.findAll('.main-menu a')).toHaveLength(4)
  })

  it('marks the item of the current page, ignoring the locale prefix', async () => {
    const { wrapper } = await mountWithApp(AppHeader, { path: '/ro/contacts' })

    expect(wrapper.findAll('.main-menu li.active a').map((link) => link.text())).toEqual(['Contacts'])
    expect(wrapper.get('.main-menu li.active a').attributes('aria-current')).toBe('page')
  })

  it('keeps the locale prefix of the page in its links', async () => {
    const { wrapper } = await mountWithApp(AppHeader, { path: '/ro/contacts' })

    expect(wrapper.get('.site-logo').attributes('href')).toBe('/ro')
    expect(wrapper.findAll('.main-menu a').map((link) => link.attributes('href'))).toEqual([
      '/ro/collections',
      '/ro/accessories',
      '/ro/about',
      '/ro/contacts',
    ])
  })
})

describe('MobileMenu', () => {
  const open = async (path = '/') => {
    const mounted = await mountWithApp(MobileMenu, { path })
    const layout = useLayout(mounted.pinia)
    layout.toggleMobileMenu()
    await flushPromises()
    return { ...mounted, layout }
  }

  it('the menu button opens and closes the drawer and reports its state', async () => {
    const { wrapper, pinia } = await mountWithApp(MobileMenu)
    const layout = useLayout(pinia)
    const button = wrapper.get('.menu-button')
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('#mobile-menu').attributes('hidden')).toBeDefined()

    await button.trigger('click')
    expect(layout.isMobileMenuVisible).toBe(true)
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('#mobile-menu').attributes('hidden')).toBeUndefined()

    await button.trigger('click')
    expect(layout.isMobileMenuVisible).toBe(false)
  })

  it('moves the focus into the drawer when it opens and back to the button when it closes', async () => {
    const { wrapper, layout } = await open()
    expect(document.activeElement).toBe(wrapper.get('.drawer-close').element)

    layout.hideMobileMenu()
    await flushPromises()
    expect(document.activeElement).toBe(wrapper.get('.menu-button').element)
  })

  it('Escape, the close button and the backdrop close it', async () => {
    const { wrapper, layout } = await open()
    await wrapper.get('#mobile-menu').trigger('keydown', { key: 'Escape' })
    expect(layout.isMobileMenuVisible).toBe(false)

    layout.toggleMobileMenu()
    await flushPromises()
    await wrapper.get('.drawer-close').trigger('click')
    expect(layout.isMobileMenuVisible).toBe(false)

    layout.toggleMobileMenu()
    await flushPromises()
    await wrapper.get('.drawer-backdrop').trigger('click')
    expect(layout.isMobileMenuVisible).toBe(false)
  })

  it('choosing a destination closes it, even when it is the current page', async () => {
    const { wrapper, layout } = await open('/contacts')

    await wrapper.findAll('.drawer-links a')[3]!.trigger('click')
    expect(layout.isMobileMenuVisible).toBe(false)
  })

  it('keeps Tab inside the drawer', async () => {
    const { wrapper } = await open()
    const focusable = wrapper.findAll('#mobile-menu a, #mobile-menu button')
    const last = focusable[focusable.length - 1]!.element as HTMLElement
    last.focus()

    await wrapper.get('#mobile-menu').trigger('keydown', { key: 'Tab' })

    expect(document.activeElement).toBe(wrapper.get('.drawer-close').element)
  })

  it('lists every language by name', async () => {
    const { wrapper } = await open()

    expect(wrapper.findAll('.language-selector button').map((button) => button.text())).toEqual([
      'English',
      'Українська',
      'Русский',
      'Română',
    ])
  })
})
