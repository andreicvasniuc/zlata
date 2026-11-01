import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import type { Slide } from '@shared/types'
import { mountWithApp } from '../test/helpers'
import SlideCarousel from './SlideCarousel.vue'

const embla = vi.hoisted(() => vi.fn())
const autoplay = vi.hoisted(() => vi.fn())

vi.mock('embla-carousel-vue', () => ({
  default: (...args: unknown[]) => {
    embla(...args)
    return [ref(), ref()]
  },
}))
vi.mock('embla-carousel-autoplay', () => ({
  default: (options: unknown) => {
    autoplay(options)
    return { name: 'autoplay' }
  },
}))

const slides: Slide[] = [
  {
    id: '1',
    title: 'First',
    link_text: 'See',
    link_url: '/collection-a',
    published: true,
    slug: 'a',
    image: { id: 'i1', url: 'a.jpg' },
  },
  {
    id: '2',
    title: 'Second',
    link_text: 'Visit',
    link_url: 'https://example.com',
    published: true,
    slug: 'b',
    image: { id: 'i2', url: 'b.jpg' },
  },
]

describe('SlideCarousel', () => {
  beforeEach(() => {
    embla.mockClear()
    autoplay.mockClear()
  })
  afterEach(() => document.body.replaceChildren())

  it('autoplays every 5 seconds, pausing on hover, when the slider has autoplay set', async () => {
    await mountWithApp(SlideCarousel, { props: { slides, autoplay: true } })

    expect(autoplay).toHaveBeenCalledWith({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
    expect(embla).toHaveBeenCalledWith({ loop: true }, [{ name: 'autoplay' }])
  })

  it('does not autoplay without the flag', async () => {
    await mountWithApp(SlideCarousel, { props: { slides, autoplay: false } })

    expect(autoplay).not.toHaveBeenCalled()
    expect(embla).toHaveBeenCalledWith({ loop: true }, [])
  })

  it('renders the slides with their title, link and picture; site paths keep the locale prefix', async () => {
    const { wrapper } = await mountWithApp(SlideCarousel, { props: { slides }, path: '/ua' })

    const items = wrapper.findAll('.embla__slide')
    expect(items).toHaveLength(2)
    expect(items[0]?.get('h2').text()).toBe('First')
    expect(items[0]?.get('img').attributes('src')).toBe('a.jpg')
    expect(items[0]?.get('a').attributes('href')).toBe('/ua/collection-a')
    expect(items[1]?.get('a').attributes('href')).toBe('https://example.com')
  })

  it('has no arrows or dots for a single slide', async () => {
    const { wrapper } = await mountWithApp(SlideCarousel, { props: { slides: slides.slice(0, 1) } })

    expect(wrapper.find('.slide-nav').exists()).toBe(false)
    expect(wrapper.find('.slide-dots').exists()).toBe(false)
  })
})
