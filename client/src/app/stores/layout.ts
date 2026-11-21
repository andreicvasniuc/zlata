import { defineStore } from 'pinia'

// Below 1024px the header shows the menu button instead of the menu (the layout itself is responsive CSS).
export const MOBILE_MAX_WIDTH = 1023
// The transparent header of the home page turns solid after this many scrolled pixels.
const SCROLLED_AFTER = 40

export const useLayout = defineStore('layout', {
  state: () => ({
    isMobile: false,
    isMobileMenuVisible: false,
    isScrolled: false,
  }),
  actions: {
    onResize(width: number) {
      this.isMobile = width <= MOBILE_MAX_WIDTH
      if (!this.isMobile) this.isMobileMenuVisible = false
    },
    onScroll(scrollTop: number) {
      this.isScrolled = scrollTop > SCROLLED_AFTER
    },
    toggleMobileMenu() {
      this.isMobileMenuVisible = !this.isMobileMenuVisible
    },
    hideMobileMenu() {
      this.isMobileMenuVisible = false
    },
  },
})
