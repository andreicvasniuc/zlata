import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useLayout, type Section } from '../stores/layout'

export interface MenuItem {
  name: string
  // path without the locale prefix
  url: string
  // dress collections and their products belong to Collections, accessory ones to Accessories
  section?: Section
}

const LOCALE_PREFIX = /^\/(en|ua|ru|ro)(?=\/|$)/

// Home, Collections, Accessories, Contacts. All of them are visible at once, no drop-down.
export function useMenu() {
  const { t } = useI18n()
  const route = useRoute()
  const layout = useLayout()

  const menu = computed<MenuItem[]>(() => [
    { name: t('HOME'), url: '/' },
    { name: t('COLLECTIONS'), url: '/collections', section: 'collections' },
    { name: t('ACCESSORIES'), url: '/accessories', section: 'accessories' },
    { name: t('CONTACTS'), url: '/contacts' },
  ])

  const currentPath = computed(() => route.path.replace(LOCALE_PREFIX, '') || '/')
  const isActive = (item: MenuItem) => {
    if (route.meta.page === 'collection' || route.meta.page === 'product') {
      return !!item.section && item.section === layout.activeSection
    }
    return item.url === currentPath.value
  }

  return { menu, isActive }
}
