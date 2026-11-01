import { defineStore } from 'pinia'

// Only the mobile drawer needs shared state: the header and the page frame both react to it.
export const useLayout = defineStore('layout', {
  state: () => ({
    isMobileMenuVisible: false,
  }),
  actions: {
    toggleMobileMenu() {
      this.isMobileMenuVisible = !this.isMobileMenuVisible
    },
    hideMobileMenu() {
      this.isMobileMenuVisible = false
    },
  },
})
