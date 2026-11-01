import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { collectionsApi } from '@shared/api/resources/public'

export interface MenuItem {
  name: string
  // path without the locale prefix
  url: string
}

// Evening dresses are an ordinary collection with this slug; the menu entry appears once that collection is published.
export const EVENING_DRESSES_SLUG = 'evening-dresses'

const LOCALE_PREFIX = /^\/(en|ua|ru|ro)(?=\/|$)/

// Collections, Evening dresses (when published), Accessories, About, Contact. Home is the logo.
export function useMenu() {
  const { t } = useI18n()
  const route = useRoute()

  // the API client caches the list, so every menu and page that asks shares one request
  const hasEveningDresses = ref(false)
  void (async () => {
    try {
      const { collections } = await collectionsApi.dresses()
      hasEveningDresses.value = (collections ?? []).some((collection) => collection.slug === EVENING_DRESSES_SLUG)
    } catch {
      // the menu simply stays without the entry
    }
  })()

  const menu = computed<MenuItem[]>(() => [
    { name: t('COLLECTIONS'), url: '/collections' },
    ...(hasEveningDresses.value ? [{ name: t('EVENING_DRESSES'), url: `/${EVENING_DRESSES_SLUG}` }] : []),
    { name: t('ACCESSORIES'), url: '/accessories' },
    { name: t('ABOUT'), url: '/about' },
    { name: t('CONTACTS'), url: '/contacts' },
  ])

  const currentPath = computed(() => route.path.replace(LOCALE_PREFIX, '') || '/')
  const isActive = (item: MenuItem) => currentPath.value === item.url || currentPath.value.startsWith(`${item.url}/`)

  return { menu, isActive }
}
