import { defineStore } from 'pinia'

// A dress the visitor saved with the heart button. Kept in localStorage, so the list survives reloads on this device.
export interface FavouriteItem {
  id: string
  name: string
  // path without the locale prefix
  url: string
  image?: string
}

export const FAVOURITES_KEY = 'zlata.favourites'

function read(): FavouriteItem[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(FAVOURITES_KEY) ?? '[]')
    return Array.isArray(saved)
      ? saved.filter((item): item is FavouriteItem => !!item && typeof item.id === 'string' && typeof item.url === 'string')
      : []
  } catch {
    return []
  }
}

function write(items: FavouriteItem[]) {
  try {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(items))
  } catch {
    // private mode or a full storage: the list still works until the page is closed
  }
}

export const useFavourites = defineStore('favourites', {
  state: () => ({ items: read() }),
  getters: {
    count: (state) => state.items.length,
    has: (state) => (id: string) => state.items.some((item) => item.id === id),
  },
  actions: {
    toggle(item: FavouriteItem) {
      this.items = this.has(item.id) ? this.items.filter((saved) => saved.id !== item.id) : [item, ...this.items]
      write(this.items)
    },
    remove(id: string) {
      this.items = this.items.filter((item) => item.id !== id)
      write(this.items)
    },
  },
})
