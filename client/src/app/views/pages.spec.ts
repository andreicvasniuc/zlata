import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { FetchError } from '@shared/api'
import type { Collection, Product } from '@shared/types'
import { mountWithApp } from '../test/helpers'
import CollectionListView from './CollectionListView.vue'
import CollectionView from './CollectionView.vue'
import AboutView from './AboutView.vue'
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

    await mountWithApp(AboutView, { path: '/about' })
    expect(document.title).toBe(`About | ${SITE}`)
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

describe('failed requests', () => {
  it('offer a retry, an unknown page does not', async () => {
    api.collectionsApi.get.mockImplementation(async () => {
      throw new Error('500')
    })
    const failed = await mountWithApp(CollectionView, { path: '/queen' })
    expect(failed.wrapper.text()).toContain('could not be loaded')
    expect(failed.wrapper.text()).toContain('Try again')

    api.collectionsApi.get.mockRejectedValue(notFound())
    const missing = await mountWithApp(CollectionView, { path: '/nope' })
    expect(missing.wrapper.text()).not.toContain('Try again')
    expect(missing.wrapper.get('.not-found a').attributes('href')).toBe('/collections')
    expect(missing.wrapper.get('.not-found a').text()).toBe('Browse dresses')
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

    const links = wrapper.findAll('.item-card a')
    expect(links.map((link) => link.attributes('href'))).toEqual(['/ua/queen', '/ua/love'])
    expect(wrapper.findAll('.item-card-name').map((title) => title.text())).toEqual(['Queen', 'Love'])
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

    expect(wrapper.findAll('.item-card-name').map((title) => title.text())).toEqual(['ANNA', 'CLARA'])
    expect(wrapper.findAll('.breadcrumb li').map((item) => item.text())).toEqual(['Home', 'All Collections', 'Queen'])
  })

  it('shows the "from" price under the name of priced products only', async () => {
    api.collectionsApi.get.mockResolvedValue({
      collection: collection({
        products: [product('anna', { price: 1200, currency: 'EUR' }), product('clara')],
      }),
    })
    const { wrapper } = await mountWithApp(CollectionView, { path: '/queen' })

    const cards = wrapper.findAll('.item-card')
    expect(cards[0]?.get('.price').text().replace(/\s/g, ' ')).toBe('from €1,200')
    expect(cards[1]?.find('.price').exists()).toBe(false)
  })

  it('translates the "from" label and formats the price for the language', async () => {
    api.collectionsApi.get.mockResolvedValue({
      collection: collection({ products: [product('anna', { price: 1200, currency: 'UAH' })] }),
    })
    const { wrapper } = await mountWithApp(CollectionView, { path: '/ua/queen', locale: 'ua' })

    expect(wrapper.get('.item-card .price').text().replace(/\s/g, ' ')).toBe('від 1 200 ₴')
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

    expect(wrapper.get('.product-info h1').text()).toBe('ANNA')
    expect(wrapper.get('.product-info .eyebrow').text()).toBe('Queen')
    expect(wrapper.findAll('.option-group').map((group) => group.text().replace(/\s+/g, ' '))).toEqual([
      'Colorivory',
      'Size42',
    ])
    expect(wrapper.get('.gallery-main img').attributes('src')).toBe('anna-cover.jpg')
    expect(wrapper.findAll('.gallery-thumb img').map((image) => image.attributes('src'))).toEqual([
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
  })

  it('links to the previous and next published product', async () => {
    const { wrapper } = await mountWithApp(ProductView, { path: '/ua/queen/clara' })

    expect(wrapper.get('.navigation .position').text()).toBe('2 / 2')
    expect(wrapper.get('.navigation a.arrow-left').attributes('href')).toBe('/ua/queen/anna')
    expect(wrapper.find('.navigation a.arrow-right').exists()).toBe(false)
  })

  it('has an enquiry action that names the product, plus the chosen size and color', async () => {
    const { wrapper } = await mountWithApp(ProductView, { path: '/ua/queen/anna' })
    const links = () => wrapper.findAll('a.btn-primary').map((link) => link.attributes('href'))

    expect(links()).toEqual([
      '/ua/contacts?collection=queen&product=anna',
      '/ua/contacts?collection=queen&product=anna',
    ])
    expect(wrapper.get('.enquire-inline').text()).toBe('Enquire about this dress')

    await wrapper.get('.option-chip[aria-pressed]').trigger('click') // color
    await wrapper.findAll('.option-chip')[1]!.trigger('click') // size
    expect(wrapper.findAll('.option-chip').map((chip) => chip.attributes('aria-pressed'))).toEqual(['true', 'true'])
    expect(links()[0]).toBe('/ua/contacts?collection=queen&product=anna&size=s1&color=c1')

    await wrapper.findAll('.option-chip')[1]!.trigger('click') // choosing it again clears it
    expect(links()[0]).toBe('/ua/contacts?collection=queen&product=anna&color=c1')
  })

  it('calls the action an item enquiry for accessories', async () => {
    api.collectionsApi.get.mockResolvedValue({ collection: collection({ has_accessories: true }) })
    const { wrapper } = await mountWithApp(ProductView, { path: '/queen/anna' })

    expect(wrapper.get('.enquire-inline').text()).toBe('Enquire about this item')
  })

  it('shows the description when the product has one', async () => {
    api.collectionsApi.get.mockResolvedValue({
      collection: collection({ products: [product('anna', { description: 'Lace and tulle' })] }),
    })
    const { wrapper } = await mountWithApp(ProductView, { path: '/queen/anna' })

    expect(wrapper.get('.product-info .description').text()).toBe('Lace and tulle')
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

  it('lists the contact groups next to the form, as links', async () => {
    api.contactGroupsApi.list.mockResolvedValue({
      contact_groups: [
        group('ti-email', 'Email', 'zlata@example.com'),
        group('ti-mobile', 'Phone', '+380 50 123 45 67'),
        group('ti-viber', 'Viber', '+380501234567'),
        group('ti-telegram', 'Telegram', '@zlata_fashion'),
      ],
    })
    const { wrapper } = await mountWithApp(ContactsView, { path: '/contacts' })

    expect(wrapper.find('form.contact-form').exists()).toBe(true)
    expect(wrapper.findAll('.contact-group-title').map((title) => title.text())).toEqual([
      'Email',
      'Phone',
      'Viber',
      'Telegram',
    ])
    expect(wrapper.findAll('.contact-group-item a').map((link) => link.attributes('href'))).toEqual([
      'mailto:zlata@example.com',
      'tel:+380501234567',
      'viber://chat?number=%2B380501234567',
      'https://t.me/zlata_fashion',
    ])
  })

  it('no longer shows Skype', async () => {
    api.contactGroupsApi.list.mockResolvedValue({
      contact_groups: [group('ti-skype', 'Skype', 'zlata.skype'), group('ti-email', 'Email', 'zlata@example.com')],
    })
    const { wrapper } = await mountWithApp(ContactsView, { path: '/contacts' })

    expect(wrapper.findAll('.contact-group-title').map((title) => title.text())).toEqual(['Email'])
  })

  describe('an enquiry about a dress', () => {
    beforeEach(() => {
      api.contactGroupsApi.list.mockResolvedValue({ contact_groups: [] })
      api.collectionsApi.get.mockResolvedValue({ collection: collection() })
    })
    const message = (wrapper: Awaited<ReturnType<typeof mountWithApp>>['wrapper']) =>
      (wrapper.get('#message').element as HTMLTextAreaElement).value

    it('prefills the message with the dress, its link, the size and the color', async () => {
      const { wrapper } = await mountWithApp(ContactsView, {
        path: '/ua/contacts?collection=queen&product=anna&size=s1&color=c1',
      })

      expect(wrapper.get('.contact-context').text()).toBe('Your message is about ANNA.')
      expect(message(wrapper)).toContain('Hello! I would like to ask about ANNA: ')
      expect(message(wrapper)).toContain('/ua/queen/anna')
      expect(message(wrapper)).toContain('Size: 42')
      expect(message(wrapper)).toContain('Color: ivory')
    })

    it('ignores a size or color that does not belong to the dress', async () => {
      const { wrapper } = await mountWithApp(ContactsView, {
        path: '/contacts?collection=queen&product=anna&size=nope&color=c2',
      })

      expect(message(wrapper)).toContain('ANNA')
      expect(message(wrapper)).not.toContain('Size:')
      expect(message(wrapper)).not.toContain('Color:')
    })

    it('ignores an unknown, unpublished or half-given product', async () => {
      for (const query of ['collection=queen&product=nobody', 'collection=queen&product=boris', 'product=anna']) {
        const { wrapper } = await mountWithApp(ContactsView, { path: `/contacts?${query}` })
        expect(message(wrapper)).toBe('')
        expect(wrapper.find('.contact-context').exists()).toBe(false)
      }
    })
  })
})

describe('about page', () => {
  it('has the text and links to the collections and the contacts', async () => {
    const { wrapper } = await mountWithApp(AboutView, { path: '/ro/about' })

    expect(wrapper.get('h1').text()).toBe('About')
    expect(wrapper.findAll('.about-text a').map((link) => link.attributes('href'))).toEqual([
      '/ro/collections',
      '/ro/contacts',
    ])
  })
})

describe('home page', () => {
  beforeEach(() => {
    api.collectionsApi.dresses.mockResolvedValue({ collections: [] })
  })

  it('has one hero with the picture of the first published slide', async () => {
    api.slidersApi.home.mockResolvedValue({
      slider: {
        id: 's',
        slides: [
          { id: '1', title: 'old', published: false, image: { id: 'i1', url: 'hidden.jpg' } },
          { id: '2', title: '2020', published: true, image: { id: 'i2', url: 'hero.jpg' } },
        ],
      },
    })
    api.productsApi.topList.mockResolvedValue({ products: [] })
    const { wrapper } = await mountWithApp(HomeView)

    expect(wrapper.findAll('h1')).toHaveLength(1)
    expect(wrapper.get('.hero-photo img').attributes('src')).toBe('hero.jpg')
    expect(wrapper.get('.hero a.btn-primary').attributes('href')).toBe('/collections')
  })

  it('works without a slider picture', async () => {
    api.slidersApi.home.mockResolvedValue({})
    api.productsApi.topList.mockResolvedValue({ products: [] })
    const { wrapper } = await mountWithApp(HomeView)

    expect(wrapper.find('.hero-photo').exists()).toBe(false)
    expect(wrapper.get('.hero').classes()).toContain('hero-text-only')
  })

  it('shows at most eight featured dresses, with their names', async () => {
    api.slidersApi.home.mockResolvedValue({})
    api.productsApi.topList.mockResolvedValue({
      products: Array.from({ length: 12 }, (_, index) => ({
        ...product(`p${index}`),
        collection_slug: 'queen',
      })),
    })
    const { wrapper } = await mountWithApp(HomeView)

    expect(wrapper.findAll('.featured .item-card')).toHaveLength(8)
    expect(wrapper.get('.featured .item-card-name').text()).toBe('P0')
    expect(wrapper.get('.featured .item-card a').attributes('href')).toBe('/queen/p0')
  })

  it('links to the categories, with Evening dresses once it is published', async () => {
    api.slidersApi.home.mockResolvedValue({})
    api.productsApi.topList.mockResolvedValue({ products: [] })
    api.collectionsApi.dresses.mockResolvedValue({ collections: [{ id: 'e', slug: 'evening-dresses', name: 'E' }] })
    const { wrapper } = await mountWithApp(HomeView)

    expect(wrapper.findAll('.shortcuts a').map((link) => link.attributes('href'))).toEqual([
      '/collections',
      '/evening-dresses',
      '/accessories',
    ])
  })
})
