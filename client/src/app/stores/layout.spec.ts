import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLayout } from './layout'

describe('layout store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('opens, toggles and hides the mobile menu', () => {
    const layout = useLayout()
    expect(layout.isMobileMenuVisible).toBe(false)

    layout.toggleMobileMenu()
    expect(layout.isMobileMenuVisible).toBe(true)
    layout.toggleMobileMenu()
    expect(layout.isMobileMenuVisible).toBe(false)

    layout.toggleMobileMenu()
    layout.hideMobileMenu()
    expect(layout.isMobileMenuVisible).toBe(false)
  })
})
