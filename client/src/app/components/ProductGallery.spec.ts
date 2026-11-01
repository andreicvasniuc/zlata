import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ImageFile } from '@shared/types'
import { mountWithApp } from '../test/helpers'
import ProductGallery from './ProductGallery.vue'

const lightbox = vi.hoisted(() => ({ init: vi.fn(), destroy: vi.fn(), loadAndOpen: vi.fn() }))

vi.mock('photoswipe/lightbox', () => ({
  default: class {
    init = lightbox.init
    destroy = lightbox.destroy
    loadAndOpen = lightbox.loadAndOpen
  },
}))
vi.mock('photoswipe/style.css', () => ({}))

const images: ImageFile[] = [
  { id: 'c', url: 'cover.jpg', is_cover: true },
  { id: 'a', url: 'a.jpg' },
  { id: 'b', url: 'b.jpg' },
]

const mainSrc = (wrapper: Awaited<ReturnType<typeof mountWithApp>>['wrapper']) =>
  wrapper.get('.gallery-main img').attributes('src')

describe('ProductGallery', () => {
  beforeEach(() => {
    lightbox.init.mockClear()
    lightbox.destroy.mockClear()
    lightbox.loadAndOpen.mockClear()
  })
  afterEach(() => document.body.replaceChildren())

  it('shows the first picture large with a thumbnail for every picture', async () => {
    const { wrapper } = await mountWithApp(ProductGallery, { props: { images, alt: 'Diana' } })

    expect(mainSrc(wrapper)).toBe('cover.jpg')
    expect(wrapper.get('.gallery-main img').attributes('alt')).toBe('Diana')
    expect(wrapper.findAll('.gallery-thumb')).toHaveLength(3)
    expect(wrapper.get('.gallery-count').text()).toBe('1 / 3')
  })

  it('a thumbnail changes the main picture and says which one is shown', async () => {
    const { wrapper } = await mountWithApp(ProductGallery, { props: { images } })
    const thumbs = wrapper.findAll('.gallery-thumb')
    expect(thumbs[0]?.attributes('aria-current')).toBe('true')

    await thumbs[2]!.trigger('click')

    expect(mainSrc(wrapper)).toBe('b.jpg')
    expect(thumbs[2]?.attributes('aria-current')).toBe('true')
    expect(thumbs[0]?.attributes('aria-current')).toBeUndefined()
    expect(wrapper.get('.gallery-count').text()).toBe('3 / 3')
  })

  it('a horizontal swipe moves to the next or previous picture', async () => {
    const { wrapper } = await mountWithApp(ProductGallery, { props: { images } })
    const main = wrapper.get('.gallery-main')
    const swipe = async (from: number, to: number) => {
      await main.trigger('touchstart', { touches: [{ clientX: from }] })
      await main.trigger('touchend', { changedTouches: [{ clientX: to }] })
    }

    await swipe(300, 100)
    expect(mainSrc(wrapper)).toBe('a.jpg')
    await swipe(100, 300)
    expect(mainSrc(wrapper)).toBe('cover.jpg')
    await swipe(100, 300) // already the first one
    expect(mainSrc(wrapper)).toBe('cover.jpg')
    await swipe(100, 120) // too short to count
    expect(mainSrc(wrapper)).toBe('cover.jpg')
  })

  it('opens PhotoSwipe at the shown picture with all pictures', async () => {
    const { wrapper } = await mountWithApp(ProductGallery, { props: { images } })
    expect(lightbox.init).toHaveBeenCalledOnce()

    await wrapper.findAll('.gallery-thumb')[1]!.trigger('click')
    await wrapper.get('.gallery-main').trigger('click')

    const [index, items] = lightbox.loadAndOpen.mock.calls[0]!
    expect(index).toBe(1)
    expect(items.map((item: { src: string }) => item.src)).toEqual(['cover.jpg', 'a.jpg', 'b.jpg'])
    expect(items[0]).toMatchObject({ width: 1000, height: 1500 }) // placeholder until the picture is known
  })

  it('tells PhotoSwipe the real size of a picture once it has loaded', async () => {
    const { wrapper } = await mountWithApp(ProductGallery, { props: { images } })
    const img = wrapper.get('.gallery-main img')
    Object.defineProperty(img.element, 'naturalWidth', { value: 800 })
    Object.defineProperty(img.element, 'naturalHeight', { value: 1200 })
    await img.trigger('load')

    await wrapper.get('.gallery-main').trigger('click')

    expect(lightbox.loadAndOpen.mock.calls[0]![1][0]).toMatchObject({ width: 800, height: 1200 })
  })

  it('shows a placeholder instead of a broken picture', async () => {
    const { wrapper } = await mountWithApp(ProductGallery, { props: { images } })

    await wrapper.get('.gallery-main img').trigger('error')

    expect(wrapper.get('.gallery-main .photo-fallback').text()).toBe('Photo unavailable')
  })

  it('has no thumbnails for a single picture and a placeholder for none', async () => {
    const single = await mountWithApp(ProductGallery, { props: { images: images.slice(0, 1) } })
    expect(single.wrapper.find('.gallery-thumbs').exists()).toBe(false)
    expect(single.wrapper.find('.gallery-count').exists()).toBe(false)

    const none = await mountWithApp(ProductGallery, { props: { images: [] } })
    expect(none.wrapper.get('.photo-fallback').text()).toBe('No photo yet')
  })

  it('destroys the lightbox when the gallery goes away', async () => {
    const { wrapper } = await mountWithApp(ProductGallery, { props: { images } })
    wrapper.unmount()
    expect(lightbox.destroy).toHaveBeenCalledOnce()
  })
})
