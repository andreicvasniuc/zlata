import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { FetchError } from '@shared/api'
import type { Collection, Product } from '@shared/types'
import { mountWithApp } from '../test/helpers'
import CollectionListView from './CollectionListView.vue'
import CollectionView from './CollectionView.vue'
import ContactsView from './ContactsView.vue'
import HomeView from './HomeView.vue'
import ProductView from './ProductView.vue'

const api = vi.hoisted(() => ({
  collectionsApi: { dresses: vi.fn(), accessories: vi.fn(), get: vi.fn() },
  productsApi: { topList: vi.fn() },
  sizesApi: { list: vi.fn() },
  colorsApi: { list: vi.fn() },
  slidersApi: { home: vi.fn() },
  socialNetworkingsApi: { list: vi.fn() },
  contactGroupsApi: { list: vi.fn() },
  contactsApi: { send: vi.fn() },
}))
vi.mock('@shared/api/resources/public', () => api)
vi.mock('photoswipe/lightbox', () => ({
  default: class {
    init() {}
    destroy() {}
  },
}))
vi.mock('photoswipe/style.css', () => ({}))

const SITE = 'Zlata wedding fashion'

const product = (slug: string, overrides: Partial<Product> = {}): Product => ({
  id: slug,
  name: slug.toUpperCase(),
  slug,
  published: true,
  size_ids: ['s1'],
  color_ids: ['c1'],
  images: [
    { id: `${slug}-1`, url: `${slug}-1.jpg` },
    { id: `${slug}-2`, url: `${slug}-cover.jpg`, is_cover: true },
  ],
  cover_image: { id: `${slug}-2`, url: `${slug}-cover.jpg`, is_cover: true },
  ...overrides,
})

const collection = (overrides: Partial<Collection> = {}): Collection => ({
  id: 'col',
  name: 'Queen',
  slug: 'queen',
  published: true,
  products_count: 3,
  products: [product('anna'), product('boris', { published: false }), product('clara')],
  ...overrides,
})

const notFound = () => Object.assign(new FetchError('404'), { status: 404 })

beforeEach(() => {
  api.socialNetworkingsApi.list.mockResolvedValue({ social_networkings: [] })
  api.colorsApi.list.mockResolvedValue({
    colors: [
      { id: 'c1', name: 'ivory' },
      { id: 'c2', name: 'white' },
    ],
  })
  api.sizesApi.list.mockResolvedValue({ sizes: [{ id: 's1', name: '42' }] })
})
afterEach(() => {
  vi.clearAllMocks()
  document.body.replaceChildren()
})

describe('document title', () => {
  it('home: just the site name', async () => {
    api.slidersApi.home.mockResolvedValue({})
    api.productsApi.topList.mockResolvedValue({ products: [] })
    await mountWithApp(HomeView)
    expect(document.title).toBe(SITE)
  })

  it('collections / accessories / contacts: "<page> | <site>"', async () => {
    api.collectionsApi.dresses.mockResolvedValue({ collections: [] })
    api.collectionsApi.accessories.mockResolvedValue({ collections: [] })
    api.contactGroupsApi.list.mockResolvedValue({ contact_groups: [] })

    await mountWithApp(CollectionListView, { path: '/collections' })
    expect(document.title).toBe(`All Collections | ${SITE}`)

    await mountWithApp(CollectionListView, { path: '/accessories' })
    expect(document.title).toBe(`All Accessories | ${SITE}`)

    await mountWithApp(ContactsView, { path: '/contacts' })
    expect(document.title).toBe(`Contacts | ${SITE}`)
  })

  it('collection and product pages use their names', async () => {
    api.collectionsApi.get.mockResolvedValue({ collection: collection() })

    await mountWithApp(CollectionView, { path: '/queen' })
    expect(document.title).toBe(`Queen | ${SITE}`)

    await mountWithApp(ProductView, { path: '/queen/anna' })
    expect(document.title).toBe(`ANNA | ${SITE}`)
  })

  it('not found: "<not found> | <site>"', async () => {
    api.collectionsApi.get.mockRejectedValue(notFound())

    await mountWithApp(CollectionView, { path: '/nope' })
    expect(document.title).toBe(`Page not found | ${SITE}`)
  })
})

describe('collection list', () => {
  it('lists the collections with links', async () => {
    api.collectionsApi.dresses.mockResolvedValue({
      collections: [
        { ...collection(), image: { id: 'i', url: 'queen.jpg' } },
        { ...collection({ id: 'x', name: 'Love', slug: 'love' }) },
      ],
    })
    const { wrapper } = await mountWithApp(CollectionListView, { path: '/ua/collections' })

    const links = wrapper.findAll('.portfolio-item a')
    expect(links.map((link) => link.attributes('href'))).toEqual(['/ua/queen', '/ua/love'])
    expect(wrapper.findAll('.portfolio-item h3').map((title) => title.text())).toEqual(['Queen', 'Love'])
  })

  it('goes straight to the collection when there is only one', async () => {
    api.collectionsApi.dresses.mockResolvedValue({ collections: [collection()] })
    const { router } = await mountWithApp(CollectionListView, { path: '/collections' })
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/queen')
  })

  it('says so when there are none', async () => {
    api.collectionsApi.dresses.mockResolvedValue({ collections: [] })
    const { wrapper } = await mountWithApp(CollectionListView, { path: '/collections' })

    expect(wrapper.text()).toContain('No records found')
  })
})

describe('collection page', () => {
  it('shows only published products and a breadcrumb', async () => {
    api.collectionsApi.get.mockResolvedValue({ collection: collection() })
    const { wrapper } = await mountWithApp(CollectionView, { path: '/queen' })

    expect(wrapper.findAll('.portfolio-item h3').map((title) => title.text())).toEqual(['ANNA', 'CLARA'])
    expect(wrapper.findAll('.breadcrumb li').map((item) => item.text())).toEqual(['Home', 'All Collections', 'Queen'])
  })

  it('shows the "from" price under the name of priced products only', async () => {
    api.collectionsApi.get.mockResolvedValue({
      collection: collection({
        products: [product('anna', { price: 1200, currency: 'EUR' }), product('clara')],
      }),
    })
    const { wrapper } = await mountWithApp(CollectionView, { path: '/queen' })

    const captions = wrapper.findAll('.portfolio-item figcaption')
    expect(captions[0]?.get('.price').text().replace(/\s/g, ' ')).toBe('from €1,200')
    expect(captions[1]?.find('.price').exists()).toBe(false)
  })

  it('translates the "from" label and formats the price for the language', async () => {
    api.collectionsApi.get.mockResolvedValue({
      collection: collection({ products: [product('anna', { price: 1200, currency: 'UAH' })] }),
    })
    const { wrapper } = await mountWithApp(CollectionView, { path: '/ua/queen', locale: 'ua' })

    expect(wrapper.get('.portfolio-item .price').text().replace(/\s/g, ' ')).toBe('від 1 200 ₴')
  })

  it('files accessory collections under All Accessories', async () => {
    api.collectionsApi.get.mockResolvedValue({ collection: collection({ has_accessories: true }) })
    const { wrapper } = await mountWithApp(CollectionView, { path: '/queen' })

    expect(wrapper.findAll('.breadcrumb a')[1]?.attributes('href')).toBe('/accessories')
  })

  it('shows the not-found state for an unknown or unpublished collection', async () => {
    api.collectionsApi.get.mockRejectedValue(notFound())
    const unknown = await mountWithApp(CollectionView, { path: '/nope' })
    expect(unknown.wrapper.text()).toContain('The page you are looking for does not exist.')

    api.collectionsApi.get.mockResolvedValue({ collection: collection({ published: false }) })
    const hidden = await mountWithApp(CollectionView, { path: '/queen' })
    expect(hidden.wrapper.text()).toContain('The page you are looking for does not exist.')
  })
})

describe('product page', () => {
  beforeEach(() => {
    api.collectionsApi.get.mockResolvedValue({ collection: collection() })
  })

  it('shows the product with colours, sizes, the cover picture first and position among published products', async () => {
    const { wrapper } = await mountWithApp(ProductView, { path: '/queen/anna' })

    expect(wrapper.get('.info h1').text()).toBe('ANNA')
    expect(wrapper.get('.info .eyebrow').text()).toBe('Queen')
    expect(wrapper.findAll('.extra-field').map((field) => field.text().replace(/\s+/g, ' '))).toEqual([
      'Colorsivory',
      'Sizes42',
    ])
    expect(wrapper.findAll('.extra-field .chip').map((chip) => chip.text())).toEqual(['ivory', '42'])
    expect(wrapper.findAll('.gallery a').map((link) => link.attributes('href'))).toEqual([
      'anna-cover.jpg',
      'anna-1.jpg',
    ])
    expect(wrapper.get('.navigation .position').text()).toBe('1 / 2')
    expect(wrapper.findAll('.breadcrumb li').map((item) => item.text())).toEqual([
      'Home',
      'All Collections',
      'Queen',
      'ANNA',
    ])
  })

  it('shows the "from" price under the name, only when the product has one', async () => {
    api.collectionsApi.get.mockResolvedValue({
      collection: collection({ products: [product('anna', { price: 1200, currency: 'USD' }), product('clara')] }),
    })
    const priced = await mountWithApp(ProductView, { path: '/queen/anna' })
    expect(priced.wrapper.get('[data-testid=product-price]').text().replace(/\s/g, ' ')).toMatch(/^from .*1,200/)

    const plain = await mountWithApp(ProductView, { path: '/queen/clara' })
    expect(plain.wrapper.find('[data-testid=product-price]').exists()).toBe(false)
    expect(plain.wrapper.get('.price-request').text()).toBe('Price upon inquiry')
  })

  it('has an inquiry action that carries the product name to the contact page', async () => {
    const { wrapper } = await mountWithApp(ProductView, { path: '/ua/queen/anna' })

    const inquire = wrapper.get('.inquire')
    expect(inquire.text()).toBe('Inquire about “ANNA”')
    expect(inquire.attributes('href')).toBe('/ua/contacts?product=ANNA')
  })

  it('shows the compact breadcrumb header instead of a heading band', async () => {
    const { wrapper } = await mountWithApp(ProductView, { path: '/queen/anna' })

    expect(wrapper.get('.page-band').classes()).toContain('compact')
    expect(wrapper.findAll('h1')).toHaveLength(1)
    expect(wrapper.get('.page-band .navigation .position').text()).toBe('1 / 2')
  })

  it('offers asking on Instagram and Telegram when they are set up', async () => {
    api.socialNetworkingsApi.list.mockResolvedValue({
      social_networkings: [
        {
          id: '1',
          name: 'Instagram',
          url: 'https://instagram.com/zlata',
          css_class: 'ti-instagram',
          published: true,
          slug: 'i',
        },
        {
          id: '2',
          name: 'Facebook',
          url: 'https://facebook.com/zlata',
          css_class: 'ti-facebook',
          published: true,
          slug: 'f',
        },
        { id: '3', name: 'Telegram', url: 'https://t.me/zlata', css_class: 'ti-telegram', published: true, slug: 't' },
      ],
    })
    const { wrapper } = await mountWithApp(ProductView, { path: '/queen/anna' })

    const links = wrapper.findAll('.ask-buttons a')
    expect(links.map((link) => link.text())).toEqual(['Ask on Instagram', 'Ask on Telegram'])
    expect(links.map((link) => link.attributes('href'))).toEqual(['https://instagram.com/zlata', 'https://t.me/zlata'])
  })

  it('has no ask buttons without those networks', async () => {
    const { wrapper } = await mountWithApp(ProductView, { path: '/queen/anna' })

    expect(wrapper.find('.ask-buttons').exists()).toBe(false)
  })

  it('links to the previous and next published product', async () => {
    const { wrapper } = await mountWithApp(ProductView, { path: '/ua/queen/clara' })

    expect(wrapper.get('.navigation .position').text()).toBe('2 / 2')
    expect(wrapper.get('.navigation a.arrow-left').attributes('href')).toBe('/ua/queen/anna')
    expect(wrapper.get('.navigation a.arrow-left .neighbour').text()).toBe('ANNA')
    expect(wrapper.find('.navigation a.arrow-right').exists()).toBe(false)
  })

  it('shows the not-found state for an unknown or unpublished product', async () => {
    const unknown = await mountWithApp(ProductView, { path: '/queen/nobody' })
    expect(unknown.wrapper.text()).toContain('The page you are looking for does not exist.')

    const hidden = await mountWithApp(ProductView, { path: '/queen/boris' })
    expect(hidden.wrapper.text()).toContain('The page you are looking for does not exist.')
    expect(document.title).toBe(`Page not found | ${SITE}`)
  })
})

describe('contacts page', () => {
  const group = (cssClass: string, name: string, value: string) => ({
    id: cssClass,
    name,
    css_class: cssClass,
    published: true,
    slug: cssClass,
    contacts_count: 1,
    contacts: [{ id: `${cssClass}-c`, name: value, published: true, slug: cssClass }],
  })

  it('shows the form next to contact cards whose email, phone and messenger entries are links', async () => {
    api.contactGroupsApi.list.mockResolvedValue({
      contact_groups: [
        group('ti-email', 'Email', 'zlata@example.com'),
        group('ti-mobile', 'Phone', '+380 50 123 45 67'),
        group('ti-viber', 'Viber', '+380501234567'),
        group('ti-skype', 'Skype', 'zlata.skype'),
      ],
    })
    const { wrapper } = await mountWithApp(ContactsView, { path: '/contacts' })

    expect(wrapper.find('form.contact-form').exists()).toBe(true)
    expect(wrapper.findAll('.contact-card-title').map((title) => title.text())).toEqual([
      'Email',
      'Phone',
      'Viber',
      'Skype',
    ])
    expect(wrapper.findAll('a.contact-card-row').map((link) => link.attributes('href'))).toEqual([
      'mailto:zlata@example.com',
      'tel:+380501234567',
      'viber://chat?number=%2B380501234567',
    ])
    expect(wrapper.findAll('.contact-card-action').map((action) => action.text())).toEqual([
      'Send email ↗',
      'Call ↗',
      'Chat ↗',
    ])
    // a value without a sensible link stays plain text
    expect(wrapper.findAll('p.contact-card-row').map((row) => row.text())).toEqual(['zlata.skype'])
  })

  it('has the intro under a showroom eyebrow', async () => {
    api.contactGroupsApi.list.mockResolvedValue({ contact_groups: [] })
    const { wrapper } = await mountWithApp(ContactsView, { path: '/contacts' })

    expect(wrapper.get('.contacts-info .eyebrow').text()).toBe('Bridal showroom & wholesale')
    expect(wrapper.get('.contacts-intro').text()).toContain('24 hours')
  })

  it('prefills the message when the page is opened for a product', async () => {
    api.contactGroupsApi.list.mockResolvedValue({ contact_groups: [] })
    const { wrapper } = await mountWithApp(ContactsView, { path: '/contacts?product=Diana' })

    expect((wrapper.get('#message').element as HTMLTextAreaElement).value).toContain('"Diana"')
  })
})

describe('menu highlight', () => {
  it('a dress collection page highlights Collections, an accessory one Accessories', async () => {
    api.collectionsApi.get.mockResolvedValue({ collection: collection() })
    const dress = await mountWithApp(CollectionView, { path: '/queen' })
    expect(dress.wrapper.findAll('.main-menu li.active a').map((link) => link.text())).toEqual(['Collections'])

    api.collectionsApi.get.mockResolvedValue({ collection: collection({ has_accessories: true }) })
    const accessories = await mountWithApp(CollectionView, { path: '/queen' })
    expect(accessories.wrapper.findAll('.main-menu li.active a').map((link) => link.text())).toEqual(['Accessories'])
  })

  it('a product page highlights the section of its collection', async () => {
    api.collectionsApi.get.mockResolvedValue({ collection: collection({ has_accessories: true }) })
    const { wrapper } = await mountWithApp(ProductView, { path: '/queen/anna' })

    expect(wrapper.findAll('.main-menu li.active a').map((link) => link.text())).toEqual(['Accessories'])
  })
})
