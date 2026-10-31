import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ImageFile } from '@shared/types'
import { mountWithApp } from '../test/helpers'
import ProductGallery from './ProductGallery.vue'

const lightbox = vi.hoisted(() => ({ options: undefined as unknown, init: vi.fn(), destroy: vi.fn() }))

vi.mock('photoswipe/lightbox', () => ({
  default: class {
    constructor(options: unknown) {
      lightbox.options = options
    }
    init = lightbox.init
    destroy = lightbox.destroy
  },
}))
vi.mock('photoswipe/style.css', () => ({}))

const images: ImageFile[] = [
  { id: 'c', url: 'cover.jpg', is_cover: true },
  { id: 'a', url: 'a.jpg' },
  { id: 'b', url: 'b.jpg' },
]

describe('ProductGallery', () => {
  beforeEach(() => {
    lightbox.init.mockClear()
    lightbox.destroy.mockClear()
  })
  afterEach(() => document.body.replaceChildren())

  it('renders a link to the full picture for every image, the cover first', async () => {
    const { wrapper } = await mountWithApp(ProductGallery, { props: { images, alt: 'Diana' } })

    const links = wrapper.findAll('.gallery a')
    expect(links.map((link) => link.attributes('href'))).toEqual(['cover.jpg', 'a.jpg', 'b.jpg'])
    expect(links[0]?.classes()).toContain('cover')
    expect(links[1]?.classes()).toContain('no-cover')
    expect(links[0]?.get('img').attributes('alt')).toBe('Diana')
  })

  it('opens the pictures in PhotoSwipe, created on the gallery element', async () => {
    const { wrapper } = await mountWithApp(ProductGallery, { props: { images } })

    expect(lightbox.init).toHaveBeenCalledOnce()
    expect(lightbox.options).toMatchObject({ gallery: wrapper.get('.gallery').element, children: 'a' })
  })

  it('tells PhotoSwipe the real size of a picture once it has loaded', async () => {
    const { wrapper } = await mountWithApp(ProductGallery, { props: { images } })
    const link = wrapper.findAll('.gallery a')[1]!
    expect(link.attributes('data-pswp-width')).toBe('1000') // placeholder until the picture is known

    const img = link.get('img')
    Object.defineProperty(img.element, 'naturalWidth', { value: 800 })
    Object.defineProperty(img.element, 'naturalHeight', { value: 1200 })
    await img.trigger('load')

    expect(link.attributes('data-pswp-width')).toBe('800')
    expect(link.attributes('data-pswp-height')).toBe('1200')
  })

  it('destroys the lightbox when the gallery goes away', async () => {
    const { wrapper } = await mountWithApp(ProductGallery, { props: { images } })
    wrapper.unmount()
    expect(lightbox.destroy).toHaveBeenCalledOnce()
  })
})
