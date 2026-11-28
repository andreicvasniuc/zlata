import { defineStore } from 'pinia'

export type Section = 'collections' | 'accessories'

export const useLayout = defineStore('layout', {
  state: () => ({
    isMobileMenuVisible: false,
    // the menu section a collection or product page belongs to (known once its data is loaded)
    activeSection: undefined as Section | undefined,
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
