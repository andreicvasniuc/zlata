import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithApp } from '../test/helpers'
import { useLayout } from '../stores/layout'
import AppHeader from './AppHeader.vue'
import MobileMenu from './MobileMenu.vue'

afterEach(() => document.body.replaceChildren())

describe('AppHeader', () => {
  it('has the logo, a flat menu, the language selector and the fitting button', async () => {
    const { wrapper } = await mountWithApp(AppHeader)

    expect(wrapper.get('.site-logo').attributes('href')).toBe('/')
    expect(wrapper.get('.site-logo img').attributes('alt')).toBe('Zlata wedding fashion')
    expect(wrapper.findAll('.main-menu a').map((link) => link.text())).toEqual([
      'Home',
      'Collections',
      'Accessories',
      'Contacts',
    ])
    expect(wrapper.find('.main-menu ul ul').exists()).toBe(false)
    expect(wrapper.find('.site-header-desktop .language-selector').exists()).toBe(true)
    expect(wrapper.get('.book-fitting').attributes('href')).toBe('/contacts')
  })

  it('offers a skip link to the main content', async () => {
    const { wrapper } = await mountWithApp(AppHeader)

    expect(wrapper.get('.skip-link').attributes('href')).toBe('#main')
  })

  it('highlights the item of the current page, ignoring the locale prefix', async () => {
    const { wrapper } = await mountWithApp(AppHeader, { path: '/ro/contacts' })

    expect(wrapper.findAll('.main-menu li.active a').map((link) => link.text())).toEqual(['Contacts'])
    expect(wrapper.get('.main-menu li.active a').attributes('aria-current')).toBe('page')
  })

  it('keeps Collections highlighted on a dress page and Accessories on an accessory one', async () => {
    const { wrapper, pinia } = await mountWithApp(AppHeader, { path: '/queen/anna' })
    const layout = useLayout(pinia)
    expect(wrapper.findAll('.main-menu li.active')).toHaveLength(0) // not known before the data arrives

    layout.activeSection = 'collections'
    await flushPromises()
    expect(wrapper.findAll('.main-menu li.active a').map((link) => link.text())).toEqual(['Collections'])

    layout.activeSection = 'accessories'
    await flushPromises()
    expect(wrapper.findAll('.main-menu li.active a').map((link) => link.text())).toEqual(['Accessories'])
  })

  it('keeps the locale prefix of the page in its links', async () => {
    const { wrapper } = await mountWithApp(AppHeader, { path: '/ro/contacts' })

    expect(wrapper.get('.site-logo').attributes('href')).toBe('/ro')
    expect(wrapper.findAll('.main-menu a').map((link) => link.attributes('href'))).toEqual([
      '/ro',
      '/ro/collections',
      '/ro/accessories',
      '/ro/contacts',
    ])
  })
})

describe('MobileMenu', () => {
  beforeEach(() => document.body.replaceChildren())

  // the drawer is teleported to <body>
  const drawer = () => document.querySelector<HTMLElement>('#mobile-menu')!
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
    expect(drawer().hidden).toBe(true)

    await button.trigger('click')
    expect(layout.isMobileMenuVisible).toBe(true)
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(drawer().hidden).toBe(false)

    await button.trigger('click')
    expect(layout.isMobileMenuVisible).toBe(false)
  })

  it('moves the focus into the drawer when it opens and back to the button when it closes', async () => {
    const { wrapper, layout } = await open()
    expect(document.activeElement).toBe(document.querySelector('.drawer-close'))

    layout.hideMobileMenu()
    await flushPromises()
    expect(document.activeElement).toBe(wrapper.get('.menu-button').element)
  })

  it('Escape, the close button and the backdrop close it', async () => {
    const { layout } = await open()
    drawer().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(layout.isMobileMenuVisible).toBe(false)

    layout.toggleMobileMenu()
    await flushPromises()
    document.querySelector<HTMLElement>('.drawer-close')!.click()
    expect(layout.isMobileMenuVisible).toBe(false)

    layout.toggleMobileMenu()
    await flushPromises()
    document.querySelector<HTMLElement>('.drawer-backdrop')!.click()
    expect(layout.isMobileMenuVisible).toBe(false)
  })

  it('choosing a destination closes it, even when it is the current page', async () => {
    const { layout } = await open('/contacts')

    document.querySelectorAll<HTMLElement>('.drawer-links a')[3]!.click()
    expect(layout.isMobileMenuVisible).toBe(false)
  })

  it('keeps Tab inside the drawer', async () => {
    await open()
    const items = drawer().querySelectorAll<HTMLElement>('a[href], button')
    items[items.length - 1]!.focus()

    drawer().dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))

    expect(document.activeElement).toBe(document.querySelector('.drawer-close'))
  })

  it('lists the languages and the fitting button', async () => {
    await open()

    expect([...drawer().querySelectorAll('.language-selector a')].map((link) => link.textContent?.trim())).toEqual([
      'EN',
      'UA',
      'RO',
      'RU',
    ])
    expect(drawer().querySelector('.btn-primary')?.getAttribute('href')).toBe('/contacts')
  })
})
