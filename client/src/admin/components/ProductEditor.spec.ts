import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { colorsApi, sizesApi } from '@shared/api/resources/items'
import { imagesApi, productsApi } from '@shared/api/resources/products'
import type { ImageFile, Product } from '@shared/types'
import ProductEditor from './ProductEditor.vue'
import { allByTestId, byTestId, flush, mountWithPlugins, setValue } from '../test/helpers'

vi.mock('@shared/api/resources/products', () => ({
  productsApi: { create: vi.fn(), update: vi.fn() },
  imagesApi: { upload: vi.fn(), makeCover: vi.fn(), remove: vi.fn() },
}))
vi.mock('@shared/api/resources/items', () => ({
  sizesApi: { list: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
  colorsApi: { list: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
}))

// confirmations are answered "Yes" right away (the dialog itself is PrimeVue's)
const confirmed = vi.hoisted(() => vi.fn())
vi.mock('../composables/useConfirm', () => ({
  useConfirm: () => (messageKey: string, accept: () => void) => {
    confirmed(messageKey)
    accept()
  },
}))

const image = (id: string, isCover = false): ImageFile => ({
  id,
  url: `https://example.test/${id}.jpg`,
  is_cover: isCover,
})

const product = (images: ImageFile[]): Product => ({
  id: 'p1',
  slug: 'elayza',
  name: 'Elayza',
  description: 'Lace',
  published: true,
  is_top: false,
  size_ids: ['s1'],
  color_ids: ['c1'],
  images,
})

function mountEditor(editing: Product | undefined, startTab: 'basic' | 'images' = 'images') {
  const { wrapper } = mountWithPlugins(ProductEditor, {
    props: {
      visible: true,
      'onUpdate:visible': (visible: boolean) => void wrapper.setProps({ visible }),
      collectionSlug: 'queen',
      product: editing,
      startTab,
    },
  })
  return wrapper
}

// PrimeVue's InputNumber commits the typed value on blur
function setPrice(value: string) {
  const input = document.getElementById('product-price')
  setValue(input, value)
  input?.dispatchEvent(new Event('blur'))
}

const covers = () => allByTestId('product-image').map((element) => element.textContent?.includes('Cover') ?? false)

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(sizesApi.list).mockResolvedValue([{ id: 's1', name: 'XL' }])
  vi.mocked(colorsApi.list).mockResolvedValue([{ id: 'c1', name: 'Ivory' }])
})
afterEach(() => {
  document.body.innerHTML = ''
})

describe('ProductEditor images', () => {
  it('lists the images and marks the cover', async () => {
    mountEditor(product([image('a', true), image('b')]))
    await flush()

    expect(allByTestId('product-image')).toHaveLength(2)
    expect(covers()).toEqual([true, false])
    const radios = allByTestId('image-cover') as HTMLInputElement[]
    expect(radios.map((radio) => radio.checked)).toEqual([true, false])
    expect(allByTestId('product-image')[1]!.textContent).toContain('make cover')
  })

  it('makes another image the cover', async () => {
    vi.mocked(imagesApi.makeCover).mockResolvedValue(product([image('a'), image('b', true)]))
    mountEditor(product([image('a', true), image('b')]))
    await flush()

    allByTestId('image-cover')[1]!.dispatchEvent(new Event('change', { bubbles: true }))
    await flush()

    expect(imagesApi.makeCover).toHaveBeenCalledWith('queen', 'elayza', 'b')
    expect(covers()).toEqual([false, true])
  })

  it('does nothing when the cover itself is chosen again', async () => {
    mountEditor(product([image('a', true), image('b')]))
    await flush()

    allByTestId('image-cover')[0]!.dispatchEvent(new Event('change', { bubbles: true }))
    await flush()

    expect(imagesApi.makeCover).not.toHaveBeenCalled()
  })

  it('adds an image by URL and makes the first image of a product its cover', async () => {
    vi.mocked(imagesApi.upload).mockResolvedValue(product([image('a')]))
    vi.mocked(imagesApi.makeCover).mockResolvedValue(product([image('a', true)]))
    mountEditor(product([]))
    await flush()

    setValue(byTestId('image-url'), 'https://example.test/a.jpg')
    await flush()
    byTestId('image-upload')!.click()
    await flush()

    expect(imagesApi.upload).toHaveBeenCalledWith('queen', 'elayza', 'https://example.test/a.jpg')
    expect(imagesApi.makeCover).toHaveBeenCalledWith('queen', 'elayza', 'a')
    expect(covers()).toEqual([true])
  })

  it('keeps the cover when a further image is added', async () => {
    vi.mocked(imagesApi.upload).mockResolvedValue(product([image('a', true), image('b')]))
    mountEditor(product([image('a', true)]))
    await flush()

    setValue(byTestId('image-url'), 'https://example.test/b.jpg')
    await flush()
    byTestId('image-upload')!.click()
    await flush()

    expect(imagesApi.makeCover).not.toHaveBeenCalled()
    expect(allByTestId('product-image')).toHaveLength(2)
  })

  it('does not upload an empty URL', async () => {
    mountEditor(product([]))
    await flush()

    expect((byTestId('image-upload') as HTMLButtonElement).disabled).toBe(true)
    setValue(byTestId('image-url'), '   ')
    await flush()
    expect((byTestId('image-upload') as HTMLButtonElement).disabled).toBe(true)
  })

  it('deletes an image after a confirmation', async () => {
    vi.mocked(imagesApi.remove).mockResolvedValue(product([image('a', true)]))
    mountEditor(product([image('a', true), image('b')]))
    await flush()

    allByTestId('image-delete')[1]!.click()
    await flush()

    expect(confirmed).toHaveBeenCalledWith('DELETE_IMAGE_MESSAGE')
    expect(imagesApi.remove).toHaveBeenCalledWith('queen', 'elayza', 'b')
    expect(allByTestId('product-image')).toHaveLength(1)
  })

  it('keeps the image when the deletion fails', async () => {
    vi.mocked(imagesApi.remove).mockRejectedValue(new Error('boom'))
    mountEditor(product([image('a', true), image('b')]))
    await flush()

    allByTestId('image-delete')[1]!.click()
    await flush()

    expect(allByTestId('product-image')).toHaveLength(2)
  })
})

describe('ProductEditor form', () => {
  it('sends the selected sizes and colors back unchanged when only the name changes', async () => {
    vi.mocked(productsApi.update).mockResolvedValue(product([]))
    mountEditor(product([]), 'basic')
    await flush()

    setValue(document.getElementById('product-name'), 'Elayza 2')
    await flush()
    byTestId('editor-save')!.click()
    await flush()

    expect(productsApi.update).toHaveBeenCalledWith('queen', 'elayza', {
      name: 'Elayza 2',
      description: 'Lace',
      published: true,
      is_top: false,
      size_ids: ['s1'],
      color_ids: ['c1'],
      price: null,
      currency: null,
    })
  })

  it('keeps the price and currency of a priced product', async () => {
    vi.mocked(productsApi.update).mockResolvedValue(product([]))
    mountEditor({ ...product([]), price: 1200, currency: 'USD' }, 'basic')
    await flush()

    expect((document.getElementById('product-price') as HTMLInputElement).value).toBe('1,200')
    byTestId('editor-save')!.click()
    await flush()

    expect(productsApi.update).toHaveBeenCalledWith(
      'queen',
      'elayza',
      expect.objectContaining({ price: 1200, currency: 'USD' }),
    )
  })

  it('sends the price with the default currency EUR when only an amount is entered', async () => {
    vi.mocked(productsApi.create).mockResolvedValue(product([]))
    mountEditor(undefined, 'basic')
    await flush()

    setValue(document.getElementById('product-name'), 'Elayza')
    setPrice('950')
    await flush()
    byTestId('editor-save')!.click()
    await flush()

    expect(productsApi.create).toHaveBeenCalledWith(
      'queen',
      expect.objectContaining({ name: 'Elayza', price: 950, currency: 'EUR' }),
    )
  })

  it('clears the price and the currency when the amount is cleared', async () => {
    vi.mocked(productsApi.update).mockResolvedValue(product([]))
    mountEditor({ ...product([]), price: 1200, currency: 'UAH' }, 'basic')
    await flush()

    setPrice('')
    await flush()
    byTestId('editor-save')!.click()
    await flush()

    expect(productsApi.update).toHaveBeenCalledWith(
      'queen',
      'elayza',
      expect.objectContaining({ price: null, currency: null }),
    )
  })

  it('creates a product in the collection and opens the image tab', async () => {
    vi.mocked(productsApi.create).mockResolvedValue(product([]))
    mountEditor(undefined, 'basic')
    await flush()

    expect((byTestId('editor-save') as HTMLButtonElement).disabled).toBe(true)
    setValue(document.getElementById('product-name'), 'Elayza')
    await flush()
    byTestId('editor-save')!.click()
    await flush()

    expect(productsApi.create).toHaveBeenCalledWith('queen', {
      name: 'Elayza',
      description: '',
      published: false,
      is_top: false,
      size_ids: [],
      color_ids: [],
      price: null,
      currency: null,
    })
    expect(byTestId('image-url')).not.toBeNull()
  })
})
