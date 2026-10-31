import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLayout } from './layout'

describe('layout store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('treats windows up to 768px as mobile', () => {
    const layout = useLayout()
    layout.onResize(768)
    expect(layout.isMobile).toBe(true)
    layout.onResize(769)
    expect(layout.isMobile).toBe(false)
  })

  it('turns the header white after 70px and fades the heading out over 300px', () => {
    const layout = useLayout()
    layout.onScroll(70)
    expect(layout.isScrolled).toBe(false)
    layout.onScroll(71)
    expect(layout.isScrolled).toBe(true)
    layout.onScroll(150)
    expect(layout.headingOpacity).toBeCloseTo(0.5)
  })

  it('closes the mobile menu on scroll and resize', () => {
    const layout = useLayout()
    layout.toggleMobileMenu()
    layout.onScroll(5)
    expect(layout.isMobileMenuVisible).toBe(false)

    layout.toggleMobileMenu()
    layout.onResize(400)
    expect(layout.isMobileMenuVisible).toBe(false)
  })
})
