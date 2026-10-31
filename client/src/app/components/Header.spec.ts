import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithApp } from '../test/helpers'
import { useLayout } from '../stores/layout'
import AppHeader from './AppHeader.vue'
import MobileMenu from './MobileMenu.vue'

vi.mock('@shared/api/resources/public', () => ({
  slidersApi: { home: vi.fn().mockResolvedValue({ slider: { id: 's', slides: [], published: true } }) },
}))

describe('AppHeader (desktop)', () => {
  afterEach(() => document.body.replaceChildren())

  it('has the logo, the menu with a Catalog sub menu and the language selector', async () => {
    const { wrapper } = await mountWithApp(AppHeader, { props: { heading: 'All Collections' } })

    expect(wrapper.find('#fh5co-header-section').exists()).toBe(true)
    expect(wrapper.find('#fh5co-logo-mobile-wrap').exists()).toBe(false)
    const top = wrapper.findAll('#fh5co-primary-menu > li > a').map((link) => link.text())
    expect(top.slice(0, 3)).toEqual(['Home', 'Catalog', 'Contacts'])
    expect(wrapper.findAll('#fh5co-primary-menu .fh5co-sub-menu a').map((link) => link.attributes('href'))).toContain(
      '/accessories',
    )
    expect(wrapper.find('.language-selector').exists()).toBe(true)
  })

  it('shows the heading in the hero and the page heading text', async () => {
    const { wrapper } = await mountWithApp(AppHeader, { props: { heading: 'All Collections' } })

    expect(wrapper.get('#fh5co-hero h1').text()).toBe('All Collections')
    expect(wrapper.get('#fh5co-hero h2').text()).toBe('Zlata wedding-fashion')
  })

  it('swaps the white logo for the black one and turns white after scrolling', async () => {
    const { wrapper, pinia } = await mountWithApp(AppHeader)
    const header = wrapper.get('#fh5co-header-section')
    expect(header.classes()).not.toContain('fh5co-scrolled')

    useLayout(pinia).onScroll(120)
    await flushPromises()

    expect(header.classes()).toContain('fh5co-scrolled')
    const [white, black] = wrapper.findAll('#fh5co-logo img')
    expect(white?.attributes('style')).toContain('display: none')
    expect(black?.attributes('style') ?? '').not.toContain('display: none')
  })

  it('highlights the item of the current page, ignoring the locale prefix', async () => {
    const { wrapper } = await mountWithApp(AppHeader, { path: '/ro/contacts' })

    expect(wrapper.findAll('#fh5co-primary-menu > li.active > a').map((link) => link.text())).toEqual(['Contacts'])
  })

  it('keeps the locale prefix of the page in its links', async () => {
    const { wrapper } = await mountWithApp(AppHeader, { path: '/ro/contacts' })

    expect(wrapper.findAll('#fh5co-primary-menu > li > a')[0]?.attributes('href')).toBe('/ro')
    expect(wrapper.findAll('#fh5co-primary-menu > li > a')[2]?.attributes('href')).toBe('/ro/contacts')
  })

  it('renders the slider instead of the hero on the home page', async () => {
    const { wrapper } = await mountWithApp(AppHeader, { props: { isSliderVisible: true } })

    expect(wrapper.find('#fh5co-hero').exists()).toBe(false)
    expect(wrapper.find('.slider').exists()).toBe(true)
  })

  it('renders the mobile header instead on narrow windows', async () => {
    const { wrapper, pinia } = await mountWithApp(AppHeader)
    useLayout(pinia).onResize(375)
    await flushPromises()

    expect(wrapper.find('#fh5co-header-section').exists()).toBe(false)
    expect(wrapper.find('#fh5co-logo-mobile-wrap').exists()).toBe(true)
  })
})

describe('MobileMenu', () => {
  beforeEach(() => document.body.replaceChildren())

  it('the button opens and closes the menu', async () => {
    const { wrapper, pinia } = await mountWithApp(MobileMenu)
    const layout = useLayout(pinia)

    await wrapper.get('#fh5co-mobile-menu-btn').trigger('click')
    expect(layout.isMobileMenuVisible).toBe(true)
    await wrapper.get('#fh5co-mobile-menu-btn').trigger('click')
    expect(layout.isMobileMenuVisible).toBe(false)
  })

  it('a click outside the menu closes it, a click inside does not', async () => {
    const { wrapper, pinia } = await mountWithApp(MobileMenu)
    const layout = useLayout(pinia)
    layout.toggleMobileMenu()

    await wrapper.get('#fh5co-mobile-menu').trigger('click')
    expect(layout.isMobileMenuVisible).toBe(true)

    document.body.click()
    expect(layout.isMobileMenuVisible).toBe(false)
  })

  it('scrolling closes the menu', async () => {
    const { pinia } = await mountWithApp(MobileMenu)
    const layout = useLayout(pinia)
    layout.toggleMobileMenu()

    layout.onScroll(10)
    expect(layout.isMobileMenuVisible).toBe(false)
  })

  it('Catalog expands its sub menu instead of navigating', async () => {
    const { wrapper, router } = await mountWithApp(MobileMenu, { path: '/contacts' })
    const subMenu = wrapper.get('#fh5co-mobile-menu-ul .fh5co-sub-menu')
    expect(subMenu.classes()).not.toContain('open')

    await wrapper.findAll('#fh5co-mobile-menu-ul > li > a')[1]!.trigger('click')
    await flushPromises()

    expect(subMenu.classes()).toContain('open')
    expect(router.currentRoute.value.path).toBe('/contacts')
  })
})
