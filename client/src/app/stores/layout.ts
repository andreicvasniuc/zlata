import { defineStore } from 'pinia'

// Same breakpoint as the old site: windows narrower than 769px get the mobile header and menu.
export const MOBILE_MAX_WIDTH = 768
// The header turns white after this many scrolled pixels; the hero heading fades out over 300px.
const SCROLLED_AFTER = 70
const HEADING_FADE_DISTANCE = 300

export const useLayout = defineStore('layout', {
  state: () => ({
    isMobile: false,
    isMobileMenuVisible: false,
    isScrolled: false,
    headingOpacity: 1,
  }),
  actions: {
    onResize(width: number) {
      this.isMobile = width <= MOBILE_MAX_WIDTH
      this.isMobileMenuVisible = false
    },
    onScroll(scrollTop: number) {
      this.isScrolled = scrollTop > SCROLLED_AFTER
      this.headingOpacity = 1 - scrollTop / HEADING_FADE_DISTANCE
      this.isMobileMenuVisible = false
    },
    toggleMobileMenu() {
      this.isMobileMenuVisible = !this.isMobileMenuVisible
    },
    hideMobileMenu() {
      this.isMobileMenuVisible = false
    },
  },
})
